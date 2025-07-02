import { useState, type ReactNode } from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/useToast';

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
    cell: (_props: { item: any }) => ReactNode;
}

// Combined column type
type TableColumn = Column<any> | ActionColumn;

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

export default function SummaryView() {
    const allSalespersonsData = [
        {
            id: 'sp_001',
            name: 'María González',
            quotes: 48,
            expiredQuotes: 5,
            newCustomers: 12,
        },
    ];

    return (
        <div className="space-y-6">
            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">Todos los Vendedores</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Resumen de Vendedores</CardTitle>

                                <CardDescription className="mt-3">
                                    Vista general de cotizaciones, clientes
                                    nuevos y cotizaciones expiradas
                                </CardDescription>
                            </div>
                            <Button variant="outline">Exportar Datos</Button>
                        </CardHeader>

                        <CardContent>
                            <DataTable
                                columns={ columns as any }
                                data={ allSalespersonsData }
                                searchPlaceholder="Buscar por nombre de vendedor..."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
