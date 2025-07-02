import { format, subDays } from 'date-fns';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Calendar,
    FileText,
    ExternalLink,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
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

const last30DaysVSP = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 30 - i - 1);
    return {
        date: format(date, 'dd MMM'),
        cantidad: Math.floor(Math.random() * 5) + (i > 20 ? 10 : 5),
        monto: Math.floor(Math.random() * 20000) + (i > 20 ? 30000 : 15000),
    };
});

const vspByTimeData = [
    { periodo: '1-15 días', cantidad: 5, monto: 75000 },
    { periodo: '16-30 días', cantidad: 3, monto: 95000 },
    { periodo: '31-60 días', cantidad: 2, monto: 45000 },
    { periodo: '61-90 días', cantidad: 1, monto: 25000 },
    { periodo: '+90 días', cantidad: 1, monto: 10000 },
];

const vspOrders = Array.from({ length: 20 }, (_, i) => {
    const daysOld = Math.floor(Math.random() * 120) + 1;
    return {
        id: `VSP-${1000 + i}`,
        client: `Cliente VSP ${i + 1}`,
        orderDate: format(subDays(new Date(), daysOld), 'dd/MM/yyyy'),
        amount: Math.floor(Math.random() * 40000) + 5000,
        daysOld: daysOld,
        status:
            daysOld > 60
                ? 'Alto Riesgo'
                : daysOld > 30
                    ? 'Riesgo Medio'
                    : 'Normal',
        invoiceStatus: ['Pendiente', 'En proceso', 'Documentación incompleta'][
            Math.floor(Math.random() * 3)
        ],
    };
});

export default function SalesOrders() {
    const renderStatusBadge = (status: string) => {
        switch (status) {
        case 'Alto Riesgo':
            return (
                <Badge
                    variant="outline"
                    className="bg-danger/10 text-danger border-danger/20"
                >
                        Alto Riesgo
                </Badge>
            );
        case 'Riesgo Medio':
            return (
                <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                >
                        Riesgo Medio
                </Badge>
            );
        case 'Normal':
            return (
                <Badge
                    variant="outline"
                    className="bg-info/10 text-info border-info/20"
                >
                        Normal
                </Badge>
            );
        default:
            return <Badge variant="outline">{ status }</Badge>;
        }
    };

    const renderInvoiceStatusBadge = (status: string) => {
        switch (status) {
        case 'Pendiente':
            return (
                <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                >
                        Pendiente
                </Badge>
            );
        case 'En proceso':
            return (
                <Badge
                    variant="outline"
                    className="bg-info/10 text-info border-info/20"
                >
                        En proceso
                </Badge>
            );
        case 'Documentación incompleta':
            return (
                <Badge
                    variant="outline"
                    className="bg-danger/10 text-danger border-danger/20"
                >
                        Docs. incompletos
                </Badge>
            );
        default:
            return <Badge variant="outline">{ status }</Badge>;
        }
    };

    const totalVSP = vspOrders.length;
    const totalAmount = vspOrders.reduce((sum, order) => sum + order.amount, 0);
    const riskLevel =
        (vspOrders.filter((order) => order.daysOld > 30).length / totalVSP) *
        100;
    const oldestVSP = Math.max(...vspOrders.map((order) => order.daysOld));
    const averageDays = Math.round(
        vspOrders.reduce((sum, order) => sum + order.daysOld, 0) / totalVSP,
    );

    return (
        <DashboardLayout title="Ventas Sobre Pedido (VSP)">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Total VSP's sin Facturar
                            </CardTitle>
                            <CardDescription>Cantidad actual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{ totalVSP }</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Monto total: ${ totalAmount.toLocaleString() }
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Nivel de Riesgo
                            </CardTitle>
                            <CardDescription>
                                Basado en antigüedad
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <CircularProgress
                                    value={ riskLevel }
                                    color={
                                        riskLevel > 50
                                            ? 'var(--danger)'
                                            : riskLevel > 30
                                                ? 'var(--warning)'
                                                : 'var(--info)'
                                    }
                                />
                                <div>
                                    <div className="text-3xl font-bold">
                                        { Math.round(riskLevel) }%
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        { riskLevel > 50
                                            ? 'Alto riesgo'
                                            : riskLevel > 30
                                                ? 'Riesgo medio'
                                                : 'Riesgo bajo' }
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                VSP más Antigua
                                <AlertTriangle className="h-4 w-4 text-danger" />
                            </CardTitle>
                            <CardDescription>Días sin facturar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { oldestVSP } días
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Por encima del límite recomendado
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Tiempo Promedio
                                <Clock className="h-4 w-4 text-warning" />
                            </CardTitle>
                            <CardDescription>Días sin facturar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { averageDays } días
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Meta: &lt;15 días
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Tendencia de VSP's</CardTitle>
                            <CardDescription>Últimos 30 días</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={ last30DaysVSP }
                                xAxisKey="date"
                                lines={ [
                                    {
                                        dataKey: 'cantidad',
                                        name: 'Cantidad VSP',
                                        color: 'var(--primary)',
                                    },
                                ] }
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>Monto Total VSP's</CardTitle>
                            <CardDescription>
                                Últimos 30 días (MXN)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={ last30DaysVSP }
                                xAxisKey="date"
                                lines={ [
                                    {
                                        dataKey: 'monto',
                                        name: 'Monto ($)',
                                        color: 'var(--success)',
                                    },
                                ] }
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader>
                            <CardTitle>VSP's por Antigüedad</CardTitle>
                            <CardDescription>
                                Distribución por período de tiempo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={ vspByTimeData }
                                xAxisKey="periodo"
                                bars={ [
                                    {
                                        dataKey: 'cantidad',
                                        name: 'Cantidad',
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
                            <CardTitle>Monto por Antigüedad ($)</CardTitle>

                            <CardDescription>
                                Distribución por período de tiempo
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <BarChart
                                data={ vspByTimeData }
                                xAxisKey="periodo"
                                bars={ [
                                    {
                                        dataKey: 'monto',
                                        name: 'Monto ($)',
                                        color: COLOR_MAPPINGS.SECTORS
                                            .construction,
                                    },
                                ] }
                                height={ 300 }
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Listado de VSP's sin Facturar</CardTitle>

                        <CardDescription>
                            Ventas sobre pedido pendientes de facturar
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="all">
                            <TabsList className="mb-4">
                                <TabsTrigger value="all">Todos</TabsTrigger>

                                <TabsTrigger value="high-risk">
                                    Alto Riesgo
                                </TabsTrigger>

                                <TabsTrigger value="medium-risk">
                                    Riesgo Medio
                                </TabsTrigger>

                                <TabsTrigger value="normal">Normal</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                <DataTable
                                    data={ vspOrders }
                                    columns={ [
                                        { header: 'Folio', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Fecha Pedido',
                                            accessorKey: 'orderDate',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Días Pendiente',
                                            accessorKey: 'daysOld',
                                            cell: ({ item }) => (
                                                <span
                                                    className={
                                                        item.daysOld > 60
                                                            ? 'text-danger font-medium'
                                                            : item.daysOld > 30
                                                                ? 'text-warning font-medium'
                                                                : 'text-muted-foreground'
                                                    }
                                                >
                                                    { item.daysOld }
                                                </span>
                                            ),
                                        },
                                        {
                                            header: 'Riesgo',
                                            accessorKey: 'status',
                                            cell: ({ item }) =>
                                                renderStatusBadge(item.status),
                                        },
                                        {
                                            header: 'Estado Factura',
                                            accessorKey: 'invoiceStatus',
                                            cell: ({ item }) =>
                                                renderInvoiceStatusBadge(
                                                    item.invoiceStatus,
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
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Programar
                                                            seguimiento
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Solicitar factura
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Ver detalle
                                                        </span>
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>

                            <TabsContent value="high-risk">
                                <DataTable
                                    data={ vspOrders.filter(
                                        (order) => order.daysOld > 60,
                                    ) }
                                    columns={ [
                                        { header: 'Folio', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Fecha Pedido',
                                            accessorKey: 'orderDate',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Días Pendiente',
                                            accessorKey: 'daysOld',
                                            cell: ({ item }) => (
                                                <span className="text-danger font-medium">
                                                    { item.daysOld }
                                                </span>
                                            ),
                                        },
                                        {
                                            header: 'Estado Factura',
                                            accessorKey: 'invoiceStatus',
                                            cell: ({ item }) =>
                                                renderInvoiceStatusBadge(
                                                    item.invoiceStatus,
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
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Programar
                                                            seguimiento
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Solicitar factura
                                                        </span>
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>

                            <TabsContent value="medium-risk">
                                <DataTable
                                    data={ vspOrders.filter(
                                        (order) =>
                                            order.daysOld > 30 &&
                                            order.daysOld <= 60,
                                    ) }
                                    columns={ [
                                        { header: 'Folio', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Fecha Pedido',
                                            accessorKey: 'orderDate',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Días Pendiente',
                                            accessorKey: 'daysOld',
                                            cell: ({ item }) => (
                                                <span className="text-warning font-medium">
                                                    { item.daysOld }
                                                </span>
                                            ),
                                        },
                                        {
                                            header: 'Estado Factura',
                                            accessorKey: 'invoiceStatus',
                                            cell: ({ item }) =>
                                                renderInvoiceStatusBadge(
                                                    item.invoiceStatus,
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
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Programar
                                                            seguimiento
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Solicitar factura
                                                        </span>
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                    ] }
                                />
                            </TabsContent>

                            <TabsContent value="normal">
                                <DataTable
                                    data={ vspOrders.filter(
                                        (order) => order.daysOld <= 30,
                                    ) }
                                    columns={ [
                                        { header: 'Folio', accessorKey: 'id' },
                                        {
                                            header: 'Cliente',
                                            accessorKey: 'client',
                                        },
                                        {
                                            header: 'Fecha Pedido',
                                            accessorKey: 'orderDate',
                                        },
                                        {
                                            header: 'Monto',
                                            accessorKey: 'amount',
                                            cell: ({ item }) =>
                                                `$${item.amount.toLocaleString()}`,
                                        },
                                        {
                                            header: 'Días Pendiente',
                                            accessorKey: 'daysOld',
                                            cell: ({ item }) => (
                                                <span className="text-muted-foreground">
                                                    { item.daysOld }
                                                </span>
                                            ),
                                        },
                                        {
                                            header: 'Estado Factura',
                                            accessorKey: 'invoiceStatus',
                                            cell: ({ item }) =>
                                                renderInvoiceStatusBadge(
                                                    item.invoiceStatus,
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
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Programar
                                                            seguimiento
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Solicitar factura
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

                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Recomendaciones y Acciones</CardTitle>
                        <CardDescription>
                            Mejores prácticas para gestión de VSP's
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Acciones Recomendadas
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Priorizar VSP's de alto riesgo
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Contactar urgentemente a
                                                clientes con VSP's mayores a 60
                                                días.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Validar documentación
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Verificar que todos los
                                                documentos requeridos estén
                                                completos y actualizados.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Establecer fechas límite
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Definir y comunicar fechas
                                                claras para la facturación de
                                                cada VSP.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Políticas de Mejora
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Revisión semanal de VSP's
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Implementar reunión semanal para
                                                revisar estado de todas las
                                                ventas pendientes.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Comunicación proactiva
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Establecer recordatorios
                                                automáticos para clientes a los
                                                15, 30 y 45 días.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                                        <div>
                                            <p className="font-medium">
                                                Capacitación en documentación
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Instruir al equipo sobre
                                                requerimientos documentales
                                                específicos por tipo de cliente.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <h3 className="text-lg font-medium mb-4">
                                Plan de Acción Inmediato
                            </h3>
                            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-5 w-5 text-danger" />
                                    <h4 className="text-danger font-medium">
                                        Prioridad Alta: VSP's con más de 60 días
                                    </h4>
                                </div>
                                <p className="text-sm">
                                    Se requiere acción inmediata para{ ' ' }
                                    {
                                        vspOrders.filter(
                                            (order) => order.daysOld > 60,
                                        ).length
                                    }{ ' ' }
                                    VSP's que superan los 60 días sin facturar.
                                    Estas representan un total de $
                                    { vspOrders
                                        .filter((order) => order.daysOld > 60)
                                        .reduce(
                                            (sum, order) => sum + order.amount,
                                            0,
                                        )
                                        .toLocaleString() }{ ' ' }
                                    en riesgo de no facturarse.
                                </p>
                                <Button className="mt-3 bg-danger hover:bg-danger/90">
                                    Iniciar plan de recuperación
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
