import { useState, useContext } from 'react';
import { BarChart4, FileText, Target, UserPlus, Users } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import TasksList, { Task } from '@/components/dashboard/TasksList';
import CircularProgress from '@/components/dashboard/CircularProgress';
import { Progress } from '@/components/ui/progress';

import LoadingScreen from '@/components/loading';

import { UserContext } from '@/contexts/userContext';
import useQuotes from '@/hooks/data/useQuotes';

import useExpiredQuotes from '@/hooks/data/useExpiredQuotes';
import useCustomerData from '@/hooks/data/useCustomer';

// Dummy data for dashboard
const tasks: Task[] = [
    {
        id: '1',
        description: 'Seguimiento a cotización de Constructora Moderna',
        client: 'Constructora Moderna',
        orderId: 'COT-2023-089',
        priority: 'high',
        status: 'pending',
        type: 'quotation',
        dueDate: 'Hoy, 3:00 PM',
    },
    {
        id: '2',
        description: 'Contactar a cliente Universidad Nacional',
        client: 'Universidad Nacional',
        priority: 'medium',
        status: 'pending',
        type: 'follow-up',
    },
    {
        id: '3',
        description: 'Revisar cotización vencida de Muebles Modernos',
        client: 'Muebles Modernos',
        orderId: 'COT-2023-045',
        priority: 'high',
        status: 'pending',
        type: 'quotation',
        dueDate: 'Ayer',
    },
    {
        id: '4',
        description: 'Contactar a Industrias García para nueva cotización',
        client: 'Industrias García',
        priority: 'low',
        status: 'pending',
        type: 'proactive-sale',
    },
    {
        id: '5',
        description: 'Seguimiento a cliente Hospital Central',
        client: 'Hospital Central',
        priority: 'medium',
        status: 'completed',
        type: 'follow-up',
    },
];

export default function SalespersonDashboard() {
    const { user } = useContext(UserContext);

    // if(!user)
    //     return <LoadingScreen text="Cargando usario..." />

    const documentDate = new Date('2025-06-14'); // update to test different dates

    const quotesQuery = useQuotes(user.code, documentDate);
    const { pastQuotesQuery, expiredQuotesQuery } = useExpiredQuotes(
        user.code,
        documentDate,
        1,
    );
    const { customersQuery, payingCustomersQuery } = useCustomerData(
        user.code,
        documentDate,
    );

    const [pendingTasks, setPendingTasks] = useState<Task[]>(tasks);

    const salespersonQuoteGoal = 20;

    function handleCompleteTask(taskId: string) {
        setPendingTasks(
            pendingTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status:
                              task.status === 'completed'
                                  ? 'pending'
                                  : 'completed',
                    }
                    : task,
            ),
        );
    }

    function handleDeleteTask(taskId: string) {
        setPendingTasks(pendingTasks.filter((task) => task.id !== taskId));
    }

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
        <DashboardLayout title="Dashboard">
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
                { /* <MetricCard
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
                />   */ }

                { /* VSP's sin Facturar - UPDATED */ }
                { /* <MetricCard
                    title="VSP's sin Facturar"
                    value="12"
                    target="0"
                    description="Monto total: $250,000"
                    icon={ <BarChart4 className="h-6 w-6 text-info" /> }
                    detailsLink="/sales-orders"
                    detailsLabel="Ver análisis detallado"
                    trend={ { value: 8, isPositive: false } }
                    className="flex flex-col"
                /> */ }

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

            { /* Tasks List */ }
            <div className="mt-10 border rounded-lg p-6">
                <TasksList
                    tasks={ pendingTasks }
                    onComplete={ handleCompleteTask }
                    onDelete={ handleDeleteTask }
                    limit={ 3 }
                />
            </div>
        </DashboardLayout>
    );
}
