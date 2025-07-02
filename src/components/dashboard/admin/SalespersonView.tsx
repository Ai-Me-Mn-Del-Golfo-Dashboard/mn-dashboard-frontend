import { useSearchParams } from 'react-router-dom';

import { BarChart4, FileText, Target, UserPlus, Users } from 'lucide-react';

import MetricCard from '@/components/dashboard/MetricCard';
import CircularProgress from '@/components/dashboard/CircularProgress';
import { Progress } from '@/components/ui/progress';

import LoadingScreen from '@/components/loading';

import useQuotes from '@/hooks/data/useQuotes';

import useExpiredQuotes from '@/hooks/data/useExpiredQuotes';
import useCustomerData from '@/hooks/data/useCustomer';

export default function SalespersonView() {
    const [searchParams, _setSearchParams] = useSearchParams();

    const code = parseInt(searchParams.get('code'));
    const documentDate = searchParams.get('start_date')
        ? new Date(searchParams.get('start_date'))
        : new Date('2025-05-05');
    const region = searchParams.get('region');

    const quotesQuery = useQuotes(code, documentDate);
    const { pastQuotesQuery, expiredQuotesQuery } = useExpiredQuotes(
        code,
        documentDate,
        1,
    );
    const { customersQuery, payingCustomersQuery } = useCustomerData(
        code,
        documentDate,
    );

    const salespersonQuoteGoal = 20;

    function quotesToPercent() {
        return (quotesQuery.data.length / salespersonQuoteGoal) * 100;
    }

    if (
        quotesQuery.isLoading ||
        pastQuotesQuery.isLoading ||
        expiredQuotesQuery.isLoading
    )
        return <LoadingScreen text="Cargando cotizaciones..." />;
    else if (customersQuery.isLoading || payingCustomersQuery.isLoading)
        return <LoadingScreen text="Cargando clientes..." />;

    return (
        <div>
            <h1>Salesperson Data for { code }</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                { /* Meta Diaria de Cotizaciones */ }
                <MetricCard
                    title="Meta Diaria de Cotizaciones"
                    value={ `${quotesQuery.data.length} / ${salespersonQuoteGoal}` }
                    target="20 cotizaciones"
                    description="Objetivo monetario: $35,000"
                    icon={ <Target className="h-6 w-6 text-primary" /> }
                    chart={ <CircularProgress value={ quotesToPercent() } /> }
                    footer={
                        <div>Progreso: { quotesToPercent() }% completado</div>
                    }
                    detailsLink="/quotations"
                    detailsLabel="Ver más detalles"
                    trend={ { value: 5, isPositive: true } }
                />

                { /* Cotizaciones Vencidas */ }
                <MetricCard
                    title="Cotizaciones Vencidas"
                    value={ expiredQuotesQuery.data.length }
                    target="0"
                    description="Valor total: $120,000"
                    icon={ <FileText className="h-6 w-6 text-danger" /> }
                    footer={ <div>Aumentó 2 en la última semana</div> }
                    detailsLink="/quotations"
                    detailsLabel="Ver análisis detallado"
                    trend={ { value: 25, isPositive: false } }
                />

                { /* Clientes sin Cotización - UPDATED */ }
                <MetricCard
                    title="Clientes sin Cotización"
                    value={ 0 }
                    target="0"
                    description="Últimos 30 días"
                    icon={ <Users className="h-6 w-6 text-warning" /> }
                    footer={ (
                        <div>
                            Representan aproximadamente $180,000 en ventas
                            potenciales
                        </div>
                    ) }
                    detailsLink="/clients"
                    detailsLabel="Ver clientes prioritarios"
                    trend={ { value: 12, isPositive: false } }
                    className="flex flex-col"
                />

                { /* VSP's sin Facturar - UPDATED */ }
                <MetricCard
                    title="VSP's sin Facturar"
                    value="12"
                    target="0"
                    description="Monto total: $250,000"
                    icon={ <BarChart4 className="h-6 w-6 text-info" /> }
                    detailsLink="/sales-orders"
                    detailsLabel="Ver análisis detallado"
                    trend={ { value: 8, isPositive: false } }
                    className="flex flex-col"
                />

                { /* Clientes Nuevos */ }
                <MetricCard
                    title="Clientes Nuevos"
                    value={ payingCustomersQuery.data.length }
                    target="50"
                    description="Meta mensual"
                    icon={ <UserPlus className="h-6 w-6 text-success" /> }
                    chart={ (
                        <div className="w-full mt-2">
                            <Progress value={ 64 } className="h-2 w-full" />
                        </div>
                    ) }
                    footer={ (
                        <div>
                            Progreso: 64% completado (
                            { payingCustomersQuery.data.length }
                            /50)
                        </div>
                    ) }
                    detailsLink="/clients"
                    detailsLabel="Ver análisis detallado"
                    trend={ { value: 10, isPositive: true } }
                />
            </div>
        </div>
    );
}
