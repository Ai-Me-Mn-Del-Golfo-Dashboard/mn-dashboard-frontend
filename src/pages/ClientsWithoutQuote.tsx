import { useState } from 'react';

import {
    PhoneCall,
    Mail,
    AlertTriangle,
    FileText,
    FileMinus,
    History,
    User,
    ShoppingBag,
    Bot,
    Loader2,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import CircularProgress from '@/components/dashboard/CircularProgress';

import MetricCard from '@/components/dashboard/MetricCard';

import { useToast } from '@/hooks/useToast';

// Sample data for clients without quotation - extended with more relevant fields
const noQuotationClients = Array.from({ length: 15 }, (_, i) => ({
    id: `CLI-${1000 + i}`,
    name: `Cliente ${i + 1}`,
    lastQuotation:
        i < 5 ? 'Hace 35 días' : i < 10 ? 'Hace 90 días' : 'Hace 180 días',
    lastPurchase: i < 8 ? 'Hace 6 días' : 'Hace 12 días',
    potentialValue: Math.floor(Math.random() * 50000) + 10000,
    segment: ['Industrial', 'Comercial', 'Educación', 'Gobierno', 'Salud'][
        Math.floor(Math.random() * 5)
    ],
    reason:
        i % 3 === 0
            ? 'Patrón de compra'
            : i % 3 === 1
                ? 'Tipo de cliente'
                : 'Producto previo',
    recommendedProducts:
        i % 3 === 0
            ? 'Cables eléctricos, Interruptores'
            : i % 3 === 1
                ? 'Tubería PVC, Pegamento'
                : 'Cloro, Filtros',
    expectedPurchaseDate:
        i < 5 ? 'Esta semana' : i < 10 ? 'Próxima semana' : 'Este mes',
}));

// Different client segments that need quotations
const clientSegments = [
    {
        id: 'pattern',
        title: 'Por Patrón de Compra',
        count: 35,
        description:
            'Clientes con patrones regulares de compra que están fuera de su ciclo habitual',
        icon: <History className="h-5 w-5" />,
        color: 'blue',
    },
    {
        id: 'type',
        title: 'Por Tipo de Cliente',
        count: 28,
        description:
            'Clientes que por su segmento o actividad deberían estar comprando regularmente',
        icon: <User className="h-5 w-5" />,
        color: 'green',
    },
    {
        id: 'product',
        title: 'Por Producto Previo',
        count: 42,
        description:
            'Clientes que compraron productos que requieren insumos o mantenimiento',
        icon: <ShoppingBag className="h-5 w-5" />,
        color: 'amber',
    },
];

// Recommended actions based on the client type
const recommendedActions = [
    {
        clientType: 'Construcción',
        products: ['Cemento', 'Varilla', 'Pintura'],
        followUpTime: '7 días después de compra inicial',
        conversionRate: '73%',
    },
    {
        clientType: 'Plomería',
        products: ['Tubos PVC', 'Codos', 'Pegamento'],
        followUpTime: '5 días después de última compra',
        conversionRate: '85%',
    },
    {
        clientType: 'Eléctrico',
        products: ['Cables', 'Interruptores', 'Centros de carga'],
        followUpTime: 'Cada 3 semanas',
        conversionRate: '68%',
    },
];

function ClientsWithoutQuote() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { toast } = useToast();

    // Render badge for reason
    const renderReasonBadge = (reason: string) => {
        switch (reason) {
        case 'Patrón de compra':
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                >
                    <History className="h-3 w-3 mr-1" /> { reason }
                </Badge>
            );
        case 'Tipo de cliente':
            return (
                <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                >
                    <User className="h-3 w-3 mr-1" /> { reason }
                </Badge>
            );
        case 'Producto previo':
            return (
                <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                >
                    <ShoppingBag className="h-3 w-3 mr-1" /> { reason }
                </Badge>
            );
        default:
            return <Badge variant="outline">{ reason }</Badge>;
        }
    };

    const handleAIFollowUp = async (client: any) => {
        setIsLoading(client.id);

        try {
            // Replace this URL with your actual webhook URL
            const webhookUrl =
                'https://hooks.zapier.com/hooks/catch/your-webhook-id';

            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'no-cors', // Handle CORS
                body: JSON.stringify({
                    clientId: client.id,
                    clientName: client.name,
                    reason: client.reason,
                    recommendedProducts: client.recommendedProducts,
                    timestamp: new Date().toISOString(),
                }),
            });

            toast({
                title: 'Seguimiento AI programado',
                description: `Se ha programado un seguimiento para ${client.name}`,
            });
        }
        catch (error) {
            console.error('Error triggering webhook:', error);
            toast({
                title: 'Error',
                description:
                    'No se pudo enviar el seguimiento. Intente de nuevo.',
                variant: 'destructive',
            });
        }
        finally {
            setIsLoading(null);
        }
    };

    return (
        <DashboardLayout title="Clientes sin Cotización">
            <div className="space-y-8">
                { /* Stats - these are kept as requested */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-warning">
                                <AlertTriangle className="h-5 w-5" />
                                Clientes sin Cotización
                            </CardTitle>
                            <CardDescription>Últimos 30 días</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <CircularProgress
                                    value={ 15 }
                                    max={ 20 }
                                    color="var(--warning)"
                                />
                                <div>
                                    <div className="text-3xl font-bold">15</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        3 clientes de alto valor
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Oportunidad Potencial
                            </CardTitle>
                            <CardDescription>Valor sin cotizar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">$320,500</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                En oportunidades sin cotizar
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileMinus className="h-5 w-5" />
                                Tasa de Recuperación
                            </CardTitle>
                            <CardDescription>
                                Clientes reactivados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">62%</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                De los contactados el mes pasado
                            </div>
                        </CardContent>
                    </Card>
                </div>

                { /* Client Segments - New section */ }
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    { clientSegments.map((segment) => (
                        <MetricCard
                            key={ segment.id }
                            title={ segment.title }
                            value={ segment.count }
                            description={ segment.description }
                            icon={ segment.icon }
                            className={ `border-l-4 border-${segment.color}-500` }
                            detailsLink="#"
                            detailsLabel="Ver clientes"
                        />
                    )) }
                </div>

                { /* Client Table - Updated with new fields and AI Follow Up button */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Clientes que Necesitan Cotización</CardTitle>
                        <CardDescription>
                            Basado en patrones de compra, tipo de cliente y
                            productos previos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={ noQuotationClients }
                            columns={ [
                                { header: 'ID', accessorKey: 'id' },
                                { header: 'Cliente', accessorKey: 'name' },
                                {
                                    header: 'Motivo',
                                    accessorKey: 'reason',
                                    cell: ({ item }) =>
                                        renderReasonBadge(item.reason),
                                },
                                {
                                    header: 'Última Cotización',
                                    accessorKey: 'lastQuotation',
                                },
                                {
                                    header: 'Última Compra',
                                    accessorKey: 'lastPurchase',
                                },
                                {
                                    header: 'Fecha Esperada',
                                    accessorKey: 'expectedPurchaseDate',
                                },
                                {
                                    header: 'Productos Recomendados',
                                    accessorKey: 'recommendedProducts',
                                    cell: ({ item }) => (
                                        <div
                                            className="max-w-xs truncate"
                                            title={ item.recommendedProducts }
                                        >
                                            { item.recommendedProducts }
                                        </div>
                                    ),
                                },
                                {
                                    header: 'Potencial',
                                    accessorKey: 'potentialValue',
                                    cell: ({ item }) =>
                                        `$${item.potentialValue.toLocaleString()}`,
                                },
                                {
                                    header: 'Acciones',
                                    accessorKey: 'id',
                                    cell: ({ item }) => (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <PhoneCall className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Llamar
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <Mail className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Email
                                                </span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={ () =>
                                                    handleAIFollowUp(item)
                                                }
                                                disabled={ isLoading === item.id }
                                                className="gap-1 text-xs h-7 px-2"
                                            >
                                                { isLoading === item.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <Bot className="h-3 w-3" />
                                                ) }
                                                AI Follow Up
                                            </Button>
                                        </div>
                                    ),
                                },
                            ] }
                        />
                    </CardContent>
                </Card>

                { /* Best Practices */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Mejores Prácticas de Seguimiento</CardTitle>
                        <CardDescription>
                            Estrategias efectivas para diferentes tipos de
                            clientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Tipo de Cliente
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Productos Recomendados
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Tiempo de Seguimiento
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Tasa de Conversión
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { recommendedActions.map((action, index) => (
                                        <tr
                                            key={ index }
                                            className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <td className="py-3 px-4">
                                                { action.clientType }
                                            </td>
                                            <td className="py-3 px-4">
                                                { action.products.join(', ') }
                                            </td>
                                            <td className="py-3 px-4">
                                                { action.followUpTime }
                                            </td>
                                            <td className="py-3 px-4">
                                                { action.conversionRate }
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <div className="text-lg font-medium mb-4">
                                Recomendaciones Proactivas
                            </div>
                            <div className="space-y-2">
                                <ul className="text-sm space-y-4">
                                    <li className="flex items-start gap-2">
                                        <Badge className="mt-0.5 bg-blue-500 text-white">
                                            1
                                        </Badge>
                                        <div>
                                            <span className="font-medium">
                                                Para clientes con patrones de
                                                compra:
                                            </span>
                                            <p className="text-muted-foreground mt-1">
                                                Analizar frecuencia histórica y
                                                contactar cuando se acerque el
                                                próximo ciclo de compra
                                                esperado.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Badge className="mt-0.5 bg-green-500 text-white">
                                            2
                                        </Badge>
                                        <div>
                                            <span className="font-medium">
                                                Para tipos de cliente
                                                específicos:
                                            </span>
                                            <p className="text-muted-foreground mt-1">
                                                Preparar paquetes especiales por
                                                industria y contactar
                                                proactivamente basado en
                                                tendencias del sector.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Badge className="mt-0.5 bg-amber-500 text-white">
                                            3
                                        </Badge>
                                        <div>
                                            <span className="font-medium">
                                                Para seguimiento de producto:
                                            </span>
                                            <p className="text-muted-foreground mt-1">
                                                Identificar productos que
                                                requieren mantenimiento o
                                                insumos y programar alertas para
                                                contacto en el momento óptimo.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default ClientsWithoutQuote;
