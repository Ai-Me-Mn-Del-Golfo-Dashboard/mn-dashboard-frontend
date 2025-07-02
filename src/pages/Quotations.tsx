import { format, subDays } from 'date-fns';
import { Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { COLOR_MAPPINGS as SECTOR_COLOR_MAPPINGS } from '@/lib/constants';

// Sample data for charts
const _last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 30 - i - 1);
    return {
        date: format(date, 'dd MMM'),
        cotizaciones: Math.floor(Math.random() * 10) + 5,
        objetivo: 20,
    };
});

// Daily performance data for bar chart
const dailyData = Array.from({ length: 6 }, (_, i) => {
    return {
        dia: `Día ${i + 1}`,
        actual: Math.floor(Math.random() * 10) + 5,
        objetivo: 20,
        promedio: 15,
    };
});

const monthlyData = [
    { month: 'Ene', cotizaciones: 350, objetivo: 400 },
    { month: 'Feb', cotizaciones: 420, objetivo: 400 },
    { month: 'Mar', cotizaciones: 380, objetivo: 400 },
    { month: 'Abr', cotizaciones: 430, objetivo: 400 },
    { month: 'May', cotizaciones: 390, objetivo: 400 },
    { month: 'Jun', cotizaciones: 450, objetivo: 400 },
    { month: 'Jul', cotizaciones: 410, objetivo: 400 },
    { month: 'Ago', cotizaciones: 460, objetivo: 400 },
    { month: 'Sep', cotizaciones: 500, objetivo: 400 },
    { month: 'Oct', cotizaciones: 480, objetivo: 400 },
    { month: 'Nov', cotizaciones: 520, objetivo: 400 },
    { month: 'Dic', cotizaciones: 450, objetivo: 400 },
];

const pieData = [
    { name: 'Construcción', value: 35 },
    { name: 'Industrial', value: 25 },
    { name: 'Educativo', value: 20 },
    { name: 'Gobierno', value: 15 },
    { name: 'Salud', value: 5 },
];

// Sample data for tables
const expiredQuotations = Array.from({ length: 15 }, (_, i) => ({
    id: `COT-2023-${100 + i}`,
    client: `Cliente ${i + 1}`,
    amount: Math.floor(Math.random() * 50000) + 5000,
    issuedDate: format(
        subDays(new Date(), Math.floor(Math.random() * 60) + 30),
        'dd/MM/yyyy',
    ),
    expirationDate: format(
        subDays(new Date(), Math.floor(Math.random() * 20) + 1),
        'dd/MM/yyyy',
    ),
    daysExpired: Math.floor(Math.random() * 20) + 1,
    status: ['Vencida', 'En seguimiento', 'Alta prioridad'][
        Math.floor(Math.random() * 3)
    ],
}));

const activeQuotations = Array.from({ length: 20 }, (_, i) => ({
    id: `COT-2023-${200 + i}`,
    client: `Cliente Activo ${i + 1}`,
    amount: Math.floor(Math.random() * 50000) + 5000,
    issuedDate: format(
        subDays(new Date(), Math.floor(Math.random() * 20) + 1),
        'dd/MM/yyyy',
    ),
    expirationDate: format(
        subDays(new Date(), -Math.floor(Math.random() * 30) - 1),
        'dd/MM/yyyy',
    ),
    status: ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)],
}));

const COLOR_MAPPINGS = {
    quotes: 'skyblue',
    objective: 'lightgreen',
    goal: '#ff9900',
};

export default function Quotations() {
    // Status badge renderer
    const renderStatusBadge = (status: string) => {
        switch (status) {
        case 'Vencida':
            return (
                <Badge
                    variant="outline"
                    className="bg-danger/10 text-danger border-danger/20"
                >
                        Vencida
                </Badge>
            );
        case 'En seguimiento':
            return (
                <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                >
                        En seguimiento
                </Badge>
            );
        case 'Alta prioridad':
            return (
                <Badge
                    variant="outline"
                    className="bg-danger/10 text-danger border-danger/20"
                >
                        Alta prioridad
                </Badge>
            );
        case 'Alta':
            return (
                <Badge
                    variant="outline"
                    className="bg-success/10 text-success border-success/20"
                >
                        Alta
                </Badge>
            );
        case 'Media':
            return (
                <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                >
                        Media
                </Badge>
            );
        case 'Baja':
            return (
                <Badge
                    variant="outline"
                    className="bg-info/10 text-info border-info/20"
                >
                        Baja
                </Badge>
            );
        default:
            return <Badge variant="outline">{ status }</Badge>;
        }
    };

    return (
        <DashboardLayout title="Análisis de Cotizaciones">
            <div className="space-y-8">
                { /* Stats Cards */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Cotizaciones Diarias
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>Meta vs. Real</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">16 / 20</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                80% completado hoy
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Cotizaciones Mensuales
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>Meta vs. Real</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">350 / 400</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                87.5% completado este mes
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-danger">
                                Cotizaciones Vencidas
                                <AlertCircle className="h-4 w-4" />
                            </CardTitle>
                            <CardDescription>Total actualmente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">8</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Valor total: $120,000
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-success">
                                Tasa de Conversión
                                <CheckCircle className="h-4 w-4" />
                            </CardTitle>
                            <CardDescription>Últimos 30 días</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">32%</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                +5% vs. mes anterior
                            </div>
                        </CardContent>
                    </Card>
                </div>

                { /* Charts Section */ }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Cotizaciones Diarias</CardTitle>
                            <CardDescription>
                                Comparación del rendimiento diario
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <BarChart
                                data={ dailyData }
                                xAxisKey="dia"
                                bars={ [
                                    {
                                        dataKey: 'actual',
                                        name: 'Cotizaciones',
                                        color: COLOR_MAPPINGS.quotes,
                                    },
                                    {
                                        dataKey: 'objetivo',
                                        name: 'Objetivo',
                                        color: COLOR_MAPPINGS.objective,
                                    },
                                    {
                                        dataKey: 'promedio',
                                        name: 'Promedio',
                                        color: COLOR_MAPPINGS.goal,
                                    },
                                ] }
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Cotizaciones Mensuales</CardTitle>
                            <CardDescription>
                                Desempeño anual vs. objetivos
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <BarChart
                                data={ monthlyData }
                                xAxisKey="month"
                                bars={ [
                                    {
                                        dataKey: 'cotizaciones',
                                        name: 'Cotizaciones',
                                        color: COLOR_MAPPINGS.quotes,
                                    },
                                    {
                                        dataKey: 'objetivo',
                                        name: 'Objetivo',
                                        color: COLOR_MAPPINGS.objective,
                                    },
                                ] }
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Distribución por Sector</CardTitle>

                            <CardDescription>
                                Cotizaciones por tipo de cliente
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            <PieChart
                                data={ pieData }
                                colors={ [
                                    SECTOR_COLOR_MAPPINGS.SECTORS.construction,
                                ] }
                                height={ 300 }
                                innerRadius={ 60 }
                                paddingAngle={ 4 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Estadísticas de Cotizaciones</CardTitle>
                            <CardDescription>
                                Métricas relevantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Promedio Diario
                                        </div>
                                        <div className="text-2xl font-bold">
                                            18.5
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            cotizaciones
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Mejor Día
                                        </div>
                                        <div className="text-2xl font-bold">
                                            42
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            cotizaciones
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Promedio Mensual
                                        </div>
                                        <div className="text-2xl font-bold">
                                            420
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            cotizaciones
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Proyección Anual
                                        </div>
                                        <div className="text-2xl font-bold">
                                            5,040
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            cotizaciones
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="text-sm font-medium mb-2">
                                        Recomendaciones
                                    </div>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                                            <span>
                                                Incrementar seguimiento a
                                                cotizaciones próximas a vencer
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                                            <span>
                                                Priorizar sector industrial para
                                                cumplir meta mensual
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                { /* Quotations Tables */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Listado de Cotizaciones</CardTitle>
                        <CardDescription>
                            Gestión de cotizaciones activas y vencidas
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="active">
                            <TabsList className="mb-4">
                                <TabsTrigger value="active">
                                    Cotizaciones Activas
                                </TabsTrigger>

                                <TabsTrigger value="expired">
                                    Cotizaciones Vencidas
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="active">
                                <DataTable
                                    data={ activeQuotations }
                                    columns={ [
                                        { header: 'ID', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Fecha Emisión',
                                            accessorKey: 'issuedDate',
                                        },
                                        {
                                            header: 'Fecha Vencimiento',
                                            accessorKey: 'expirationDate',
                                        },
                                        {
                                            header: 'Acciones',
                                            accessorKey: 'id',
                                            cell: () => (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Ver detalle
                                                    </span>
                                                </Button>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>

                            <TabsContent value="expired">
                                <DataTable
                                    data={ expiredQuotations }
                                    columns={ [
                                        { header: 'ID', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Fecha Emisión',
                                            accessorKey: 'issuedDate',
                                        },
                                        {
                                            header: 'Fecha Vencimiento',
                                            accessorKey: 'expirationDate',
                                        },
                                        {
                                            header: 'Días Vencida',
                                            accessorKey: 'daysExpired',
                                            cell: ({ item }) => (
                                                <span className="text-danger font-medium">
                                                    { item.daysExpired }
                                                </span>
                                            ),
                                        },
                                        {
                                            header: 'Estado',
                                            accessorKey: 'status',
                                            cell: ({ item }) =>
                                                renderStatusBadge(item.status),
                                        },
                                        {
                                            header: 'Acciones',
                                            accessorKey: 'id',
                                            cell: () => (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Ver detalle
                                                    </span>
                                                </Button>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
