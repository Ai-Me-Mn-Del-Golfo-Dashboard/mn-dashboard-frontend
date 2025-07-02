import { useState, type ReactNode } from 'react';

import {
    RocketIcon,
    TrendingUpIcon,
    ShoppingCartIcon,
    SearchIcon,
} from 'lucide-react';

import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/DataTable';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/dashboard/CircularProgress';

import { useToast } from '@/hooks/useToast';

// Define TypeScript types for our data
interface PredictiveSalesItem {
    id: number;
    client: string;
    product: string;
    probability: number;
    lastPurchase: string;
    category: string;
}

interface CategoryData {
    name: string;
    value: number;
}

interface MonthlyTrendData {
    name: string;
    predictive: number;
    actual: number;
}

// Mock data
const predictiveSalesData: PredictiveSalesItem[] = [
    {
        id: 1,
        client: 'Constructora Acme',
        product: 'Tuberías PVC 1/2"',
        probability: 87,
        lastPurchase: '2023-10-15',
        category: 'Plomería',
    },
    {
        id: 2,
        client: 'Electricidad Total',
        product: 'Cable #12 AWG',
        probability: 92,
        lastPurchase: '2023-11-02',
        category: 'Electricidad',
    },
    {
        id: 3,
        client: 'Hotel Pacífico',
        product: 'Clorinador Automático',
        probability: 78,
        lastPurchase: '2023-09-28',
        category: 'Piscinas',
    },
    {
        id: 4,
        client: 'Ferretería Central',
        product: 'Tornillos Drywall 1"',
        probability: 65,
        lastPurchase: '2023-10-22',
        category: 'Fijación',
    },
    {
        id: 5,
        client: 'Apartamentos Marina',
        product: 'Sellante Silicona',
        probability: 81,
        lastPurchase: '2023-11-05',
        category: 'Selladores',
    },
    {
        id: 6,
        client: 'Plomería Express',
        product: 'Codos PVC 1/2"',
        probability: 89,
        lastPurchase: '2023-10-10',
        category: 'Plomería',
    },
    {
        id: 7,
        client: 'Mantenimiento Plus',
        product: 'Pintura Interior',
        probability: 72,
        lastPurchase: '2023-09-15',
        category: 'Pinturas',
    },
    {
        id: 8,
        client: 'Constructora Moderna',
        product: 'Cemento Gris',
        probability: 94,
        lastPurchase: '2023-11-08',
        category: 'Construcción',
    },
];

const categoryData: CategoryData[] = [
    { name: 'Plomería', value: 35 },
    { name: 'Electricidad', value: 25 },
    { name: 'Construcción', value: 20 },
    { name: 'Pinturas', value: 10 },
    { name: 'Otros', value: 10 },
];

const monthlyTrendData: MonthlyTrendData[] = [
    { name: 'Ene', predictive: 45, actual: 42 },
    { name: 'Feb', predictive: 52, actual: 49 },
    { name: 'Mar', predictive: 48, actual: 45 },
    { name: 'Abr', predictive: 61, actual: 59 },
    { name: 'May', predictive: 55, actual: 52 },
    { name: 'Jun', predictive: 67, actual: 65 },
    { name: 'Jul', predictive: 70, actual: 68 },
    { name: 'Ago', predictive: 75, actual: 73 },
    { name: 'Sep', predictive: 80, actual: 77 },
    { name: 'Oct', predictive: 90, actual: 84 },
    { name: 'Nov', predictive: 100, actual: 0 },
    { name: 'Dic', predictive: 110, actual: 0 },
];

// Define a column interface compatible with the DataTable component
interface Column<T> {
    accessorKey: keyof T;
    header: string;
    cell?: (_props: { item: T }) => ReactNode;
    className?: string;
}

// Define a type for action column
interface ActionColumn {
    id: string;
    cell: (_props: { item: PredictiveSalesItem }) => ReactNode;
}

// Combined column type
type TableColumn = Column<PredictiveSalesItem> | ActionColumn;

const columns: TableColumn[] = [
    { accessorKey: 'client', header: 'Cliente' },
    { accessorKey: 'product', header: 'Producto Recomendado' },
    { accessorKey: 'category', header: 'Categoría' },
    { accessorKey: 'lastPurchase', header: 'Última Compra' },
    {
        accessorKey: 'probability',
        header: 'Probabilidad',
        cell: ({ item }) => {
            const value = item.probability;
            let colorClass = 'text-yellow-500';
            if (value >= 85) colorClass = 'text-green-500';
            else if (value < 70) colorClass = 'text-red-500';

            return <div className={ `font-medium ${colorClass}` }>{ value }%</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ item }) => {
            const { id, client } = item;
            return <ActionButtons clientId={ id } clientName={ client } />;
        },
    },
];

interface ActionButtonsProps {
    clientId: number;
    clientName: string;
}

function ActionButtons({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clientId,
    clientName,
}: ActionButtonsProps) {
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    const handleAction = (actionType: string) => {
        setLoading((prev) => ({ ...prev, [actionType]: true }));

        // Simulate API call
        setTimeout(() => {
            setLoading((prev) => ({ ...prev, [actionType]: false }));
            toast({
                title: 'Acción completada',
                description: `${actionType === 'quote' ? 'Cotización creada' : 'Seguimiento programado'} para ${clientName}`,
            });
        }, 1500);
    };

    return (
        <div className="flex space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={ () => handleAction('quote') }
                disabled={ loading['quote'] }
            >
                { loading['quote'] ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                    'Crear Cotización'
                ) }
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={ () => handleAction('follow') }
                disabled={ loading['follow'] }
            >
                { loading['follow'] ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                    'Programar Llamada'
                ) }
            </Button>
        </div>
    );
}

function KPICards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Oportunidades
                    </CardTitle>
                    <RocketIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">152</div>
                    <p className="text-xs text-muted-foreground">
                        +12% del mes anterior
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Cotizaciones Generadas
                    </CardTitle>
                    <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">87</div>
                    <p className="text-xs text-muted-foreground">
                        +5% del mes anterior
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Tasa de Conversión
                    </CardTitle>
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">
                        +7% del mes anterior
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ventas Estimadas
                    </CardTitle>
                    <SearchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$87,240</div>
                    <p className="text-xs text-muted-foreground">
                        +15% del mes anterior
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function ProactiveSales() {
    return (
        <DashboardLayout title="Ventas Proactivas">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Ventas Proactivas
                </h2>
                <p className="text-muted-foreground">
                    Identifica oportunidades de venta basadas en análisis
                    predictivo de patrones de compra de clientes.
                </p>

                <KPICards />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Tendencia Mensual</CardTitle>
                            <CardDescription>
                                Comparación de ventas predictivas vs. reales
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <LineChart
                                data={ monthlyTrendData }
                                xAxisKey="name"
                                lines={ [
                                    {
                                        dataKey: 'predictive',
                                        name: 'Predictivo',
                                        color: '#0891b2',
                                    },
                                    {
                                        dataKey: 'actual',
                                        name: 'Real',
                                        color: '#6366f1',
                                    },
                                ] }
                                className="h-80"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Distribución por Categoría</CardTitle>
                            <CardDescription>
                                Oportunidades por tipo de producto
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <PieChart data={ categoryData } className="h-80" />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Precisión del Modelo Predictivo</CardTitle>
                        <CardDescription>
                            Porcentaje de aciertos en los últimos 30 días
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-10">
                        <CircularProgress
                            value={ 86 }
                            size={ 180 }
                            title="Precisión"
                        />
                    </CardContent>
                </Card>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">
                            Todas las Oportunidades
                        </TabsTrigger>
                        <TabsTrigger value="high">
                            Alta Probabilidad (&gt;85%)
                        </TabsTrigger>
                        <TabsTrigger value="medium">
                            Media Probabilidad (70-85%)
                        </TabsTrigger>
                        <TabsTrigger value="low">
                            Baja Probabilidad (&lt;70%)
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Oportunidades de Venta Proactiva
                                </CardTitle>
                                <CardDescription>
                                    Clientes con alta probabilidad de realizar
                                    compras basado en su historial
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={ columns as any }
                                    data={ predictiveSalesData }
                                    searchPlaceholder="Buscar por cliente o producto..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="high">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Oportunidades de Alta Probabilidad
                                </CardTitle>
                                <CardDescription>
                                    Clientes con más de 85% de probabilidad de
                                    compra
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={ columns as any }
                                    data={ predictiveSalesData.filter(
                                        (item) => item.probability >= 85,
                                    ) }
                                    searchPlaceholder="Buscar por cliente o producto..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="medium">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Oportunidades de Media Probabilidad
                                </CardTitle>
                                <CardDescription>
                                    Clientes con probabilidad entre 70% y 85% de
                                    compra
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={ columns as any }
                                    data={ predictiveSalesData.filter(
                                        (item) =>
                                            item.probability >= 70 &&
                                            item.probability < 85,
                                    ) }
                                    searchPlaceholder="Buscar por cliente o producto..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="low">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Oportunidades de Baja Probabilidad
                                </CardTitle>
                                <CardDescription>
                                    Clientes con menos de 70% de probabilidad de
                                    compra
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={ columns as any }
                                    data={ predictiveSalesData.filter(
                                        (item) => item.probability < 70,
                                    ) }
                                    searchPlaceholder="Buscar por cliente o producto..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

export default ProactiveSales;
