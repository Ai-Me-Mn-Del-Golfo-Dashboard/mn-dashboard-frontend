import {
    PhoneCall,
    Mail,
    BarChart3,
    Briefcase,
    AlertTriangle,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import RadarChart from '@/components/charts/RadarChart';
import DataTable from '@/components/ui/DataTable';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CircularProgress from '@/components/dashboard/CircularProgress';

import { COLOR_MAPPINGS } from '@/lib/constants';

// Sample data for charts
const monthlyNewClients = [
    { month: 'Ene', clients: 30 },
    { month: 'Feb', clients: 35 },
    { month: 'Mar', clients: 40 },
    { month: 'Abr', clients: 45 },
    { month: 'May', clients: 38 },
    { month: 'Jun', clients: 42 },
    { month: 'Jul', clients: 48 },
    { month: 'Ago', clients: 52 },
    { month: 'Sep', clients: 46 },
    { month: 'Oct', clients: 32 },
    { month: 'Nov', clients: 0 },
    { month: 'Dic', clients: 0 },
];

const sectorDistribution = [
    { name: 'Construcción', value: 40 },
    { name: 'Industrial', value: 25 },
    { name: 'Educación', value: 15 },
    { name: 'Gobierno', value: 12 },
    { name: 'Salud', value: 8 },
];

const clientTypes = [
    { name: 'Nuevos', value: 32 },
    { name: 'Recurrentes', value: 120 },
    { name: 'Inactivos', value: 45 },
];

const segmentRadarData = [
    {
        segment: 'Industrial',
        ventas: 85,
        cotizaciones: 70,
        recurrencia: 90,
        potencial: 80,
        satisfaccion: 75,
    },
    {
        segment: 'Comercial',
        ventas: 70,
        cotizaciones: 75,
        recurrencia: 65,
        potencial: 75,
        satisfaccion: 80,
    },
    {
        segment: 'Gobierno',
        ventas: 60,
        cotizaciones: 50,
        recurrencia: 55,
        potencial: 65,
        satisfaccion: 60,
    },
    {
        segment: 'Educación',
        ventas: 40,
        cotizaciones: 60,
        recurrencia: 35,
        potencial: 45,
        satisfaccion: 65,
    },
    {
        segment: 'Residencial',
        ventas: 30,
        cotizaciones: 45,
        recurrencia: 25,
        potencial: 40,
        satisfaccion: 70,
    },
];

// Sample data for tables
const noQuotationClients = Array.from({ length: 15 }, (_, i) => ({
    id: `CLI-${1000 + i}`,
    name: `Cliente sin Cotización ${i + 1}`,
    lastQuotation:
        i < 5 ? 'Hace 35 días' : i < 10 ? 'Hace 90 días' : 'Hace 180 días',
    lastPurchase: i < 8 ? 'Hace 60 días' : 'Hace 120 días',
    potentialValue: Math.floor(Math.random() * 50000) + 10000,
    segment: ['Industrial', 'Comercial', 'Educación', 'Gobierno', 'Salud'][
        Math.floor(Math.random() * 5)
    ],
    priority: i < 3 ? 'Alta' : i < 8 ? 'Media' : 'Baja',
}));

const newClients = Array.from({ length: 20 }, (_, i) => ({
    id: `CLI-${2000 + i}`,
    name: `Nuevo Cliente ${i + 1}`,
    dateAdded: `${Math.floor(Math.random() * 30) + 1}/10/2023`,
    firstPurchase: i < 12 ? 'Sí' : 'No',
    source: ['Referencia', 'Web', 'Evento', 'Llamada directa', 'Campaña'][
        Math.floor(Math.random() * 5)
    ],
    segment: ['Industrial', 'Comercial', 'Educación', 'Gobierno', 'Salud'][
        Math.floor(Math.random() * 5)
    ],
    potential: ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)],
}));

function Clients() {
    // Priority badge renderer
    const renderPriorityBadge = (priority: string) => {
        switch (priority) {
        case 'Alta':
            return (
                <Badge
                    variant="outline"
                    className="bg-danger/10 text-danger border-danger/20"
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
            return <Badge variant="outline">{ priority }</Badge>;
        }
    };

    // Potential badge renderer
    const renderPotentialBadge = (potential: string) => {
        switch (potential) {
        case 'Alto':
            return (
                <Badge
                    variant="outline"
                    className="bg-success/10 text-success border-success/20"
                >
                        Alto
                </Badge>
            );
        case 'Medio':
            return (
                <Badge
                    variant="outline"
                    className="bg-info/10 text-info border-info/20"
                >
                        Medio
                </Badge>
            );
        case 'Bajo':
            return (
                <Badge
                    variant="outline"
                    className="bg-muted/10 text-muted-foreground border-muted/20"
                >
                        Bajo
                </Badge>
            );
        default:
            return <Badge variant="outline">{ potential }</Badge>;
        }
    };

    return (
        <DashboardLayout title="Análisis de Clientes">
            <div className="space-y-8">
                { /* Client Stats */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Clientes Nuevos
                            </CardTitle>
                            <CardDescription>Progreso mensual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <CircularProgress value={ 64 } />

                                <div>
                                    <div className="text-3xl font-bold">
                                        32 / 50
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        64% de la meta mensual
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-warning">
                                Clientes sin Cotización
                                <AlertTriangle className="h-4 w-4" />
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
                                Total de Clientes
                            </CardTitle>
                            <CardDescription>
                                Activos en los últimos 90 días
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">197</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                +15% vs. trimestre anterior
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Retención de Clientes
                            </CardTitle>
                            <CardDescription>Últimos 12 meses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">82%</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                +5% vs. año anterior
                            </div>
                        </CardContent>
                    </Card>
                </div>

                { /* Main Charts */ }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Clientes Nuevos por Mes</CardTitle>
                            <CardDescription>
                                Adquisición de clientes en el año
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={ monthlyNewClients }
                                xAxisKey="month"
                                bars={ [
                                    {
                                        dataKey: 'clients',
                                        name: 'Clientes Nuevos',
                                        color: COLOR_MAPPINGS.SECTORS
                                            .construction,
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
                                Segmentación de clientes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <PieChart
                                data={ sectorDistribution }
                                colors={ [COLOR_MAPPINGS.SECTORS.construction] }
                                height={ 300 }
                                innerRadius={ 60 }
                                paddingAngle={ 4 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Tipo de Clientes</CardTitle>
                            <CardDescription>
                                Distribución del portafolio
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <PieChart
                                data={ clientTypes }
                                colors={ [COLOR_MAPPINGS.SECTORS.construction] }
                                height={ 300 }
                                innerRadius={ 60 }
                                paddingAngle={ 4 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Análisis de Segmento</CardTitle>
                            <CardDescription>
                                Desempeño por categoría de cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadarChart
                                data={ segmentRadarData }
                                radarKeys={ [
                                    {
                                        dataKey: 'ventas',
                                        name: 'Ventas',
                                        color: COLOR_MAPPINGS.SECTORS
                                            .construction,
                                    },
                                    {
                                        dataKey: 'cotizaciones',
                                        name: 'Cotizaciones',
                                        color: COLOR_MAPPINGS.SECTORS
                                            .construction,
                                    },
                                    {
                                        dataKey: 'potencial',
                                        name: 'Potencial',
                                        color: COLOR_MAPPINGS.SECTORS
                                            .construction,
                                    },
                                ] }
                                angleAxisKey="segment"
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>
                </div>

                { /* Client Tables */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Listado de Clientes</CardTitle>
                        <CardDescription>Gestión y seguimiento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="no-quotation">
                            <TabsList className="mb-4">
                                <TabsTrigger value="no-quotation">
                                    Clientes sin Cotización
                                </TabsTrigger>
                                <TabsTrigger value="new-clients">
                                    Clientes Nuevos
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="no-quotation">
                                <DataTable
                                    data={ noQuotationClients }
                                    columns={ [
                                        { header: 'ID', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'name',
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
                                            header: 'Potencial',
                                            accessorKey: 'potentialValue',
                                            cell: ({ item }) =>
                                                `$${item.potentialValue.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Segmento',
                                            accessorKey: 'segment',
                                        },
                                        {
                                            header: 'Prioridad',
                                            accessorKey: 'priority',
                                            cell: ({ item }) =>
                                                renderPriorityBadge(
                                                    item.priority,
                                                ),
                                        },
                                        {
                                            header: 'Acciones',
                                            accessorKey: 'id',
                                            cell: () => (
                                                <div className="flex items-center gap-1">
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
                                                </div>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>

                            <TabsContent value="new-clients">
                                <DataTable
                                    data={ newClients }
                                    columns={ [
                                        { header: 'ID', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'name',
                                        },
                                        {
                                            header: 'Fecha Alta',
                                            accessorKey: 'dateAdded',
                                        },
                                        {
                                            header: 'Primera Compra',
                                            accessorKey: 'firstPurchase',
                                        },
                                        {
                                            header: 'Origen',
                                            accessorKey: 'source',
                                        },
                                        {
                                            header: 'Segmento',
                                            accessorKey: 'segment',
                                        },
                                        {
                                            header: 'Potencial',
                                            accessorKey: 'potential',
                                            cell: ({ item }) =>
                                                renderPotentialBadge(
                                                    item.potential,
                                                ),
                                        },
                                        {
                                            header: 'Acciones',
                                            accessorKey: 'id',
                                            cell: () => (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <BarChart3 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Analizar
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Briefcase className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Cotizar
                                                        </span>
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                { /* Client Segments */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>
                            Segmentación de Clientes sin Cotización
                        </CardTitle>
                        <CardDescription>
                            Por período de inactividad
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-lg p-4 border shadow-sm">
                                <div className="text-muted-foreground text-sm mb-1">
                                    Sin cotizar últimos 30 días
                                </div>
                                <div className="text-2xl font-bold mb-1">
                                    15
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Potencial de recotización: 85%
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 w-full"
                                >
                                    Ver clientes
                                </Button>
                            </div>

                            <div className="rounded-lg p-4 border shadow-sm">
                                <div className="text-muted-foreground text-sm mb-1">
                                    Sin cotizar últimos 90 días
                                </div>
                                <div className="text-2xl font-bold mb-1">
                                    35
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Potencial de recotización: 65%
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 w-full"
                                >
                                    Ver clientes
                                </Button>
                            </div>

                            <div className="rounded-lg p-4 border shadow-sm">
                                <div className="text-muted-foreground text-sm mb-1">
                                    Sin cotizar últimos 180 días
                                </div>
                                <div className="text-2xl font-bold mb-1">
                                    75
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Potencial de recotización: 40%
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 w-full"
                                >
                                    Ver clientes
                                </Button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <div className="text-lg font-medium mb-4">
                                Recomendaciones
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="font-medium text-sm">
                                        Clientes sin Cotización
                                    </div>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-info text-white">
                                                1
                                            </Badge>
                                            <span>
                                                Priorizar contacto con clientes
                                                industriales sin cotizar en 30
                                                días
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-info text-white">
                                                2
                                            </Badge>
                                            <span>
                                                Ofrecer descuento especial a
                                                clientes sin cotizar en 90 días
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-info text-white">
                                                3
                                            </Badge>
                                            <span>
                                                Realizar campaña de email para
                                                reactivación de clientes
                                                inactivos
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <div className="font-medium text-sm">
                                        Clientes Nuevos
                                    </div>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-success text-white">
                                                1
                                            </Badge>
                                            <span>
                                                Enfocar adquisición en el sector
                                                Industrial para Q4
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-success text-white">
                                                2
                                            </Badge>
                                            <span>
                                                Implementar programa de
                                                referidos para incrementar
                                                captación
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 bg-success text-white">
                                                3
                                            </Badge>
                                            <span>
                                                Realizar seguimiento a clientes
                                                nuevos sin primera compra
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default Clients;
