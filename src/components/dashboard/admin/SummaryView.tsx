import { useContext, useEffect, useState, type ReactNode } from 'react';

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
import LoadingScreen from '@/components/loading';
import { fetchQuotesBySalesperson } from '@/lib/utils';
import { UserContext } from '@/contexts/userContext';
import { useSearchParams } from 'react-router-dom';

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
    { accessorKey: 'id', header: 'Salesperson' },
    { accessorKey: 'quotes', header: 'Quotes' },
    // {
    //     accessorKey: 'probability',
    //     header: 'Probabilidad',
    //     cell: ({ item }) => {
    //         const value = item.probability;
    //         let colorClass = 'text-yellow-500';
    //         if (value >= 85) colorClass = 'text-green-500';
    //         else if (value < 70) colorClass = 'text-red-500';

    //         return <div className={ `font-medium ${colorClass}` }>{ value }%</div>;
    //     },
    // },
    {
        id: 'actions',
        cell: ({ item }) => {
            const { id, client } = item;
            return <ActionButtons clientId={id} clientName={client} />;
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
                onClick={() => handleAction('quote')}
                disabled={loading['quote']}
            >
                {loading['quote'] ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                    'Crear Cotización'
                )}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('follow')}
                disabled={loading['follow']}
            >
                {loading['follow'] ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                    'Programar Llamada'
                )}
            </Button>
        </div>
    );
}

export default function SummaryView() {
    const { jwtToken } = useContext(UserContext);

    const [params, updateParams] = useSearchParams();
    
    // Get start_date search parameter
    const date = params.get('start_date')
        ? new Date(params.get('start_date'))
        : null;

    const [salespersonData, updateSalespersonData] = useState([]);
    const [isLoading, updateIsLoading] = useState(false);

    const salespersonList = [
        2340, 3393, 3331, 3341, 3148, 455, 3180, 3247, 3278, 2791, 3244, 3293,
        3099, 2282, 2357, 3023, 2895, 3348, 3269, 2800, 3196, 3274, 3238, 2040,
        2624, 2795, 2926, 2974, 3362, 3120, 3364, 901, 331, 1193, 902, 208,
    ];

    useEffect(() => {
        updateIsLoading(true);

        (async function () {
            const results = await Promise.all(
                salespersonList.map(async (salesperson) => {
                    const response = await fetchQuotesBySalesperson(
                        salesperson,
                        new Date(date ? date : '2025-07-02'),
                        jwtToken,
                    );

                    return response;
                }),
            );

            // Group results by salesperson

            const groupedResults = {};

            for(const res of results) {
                for(const result of res.results) {
                    const id = result['Salesperson Code'];
                    
                    if (!groupedResults[id]) {
                        groupedResults[id] = { id, quotes: [] };
                    }

                    groupedResults[id].quotes.push(result);
                }
            }

            console.log(groupedResults);

            const formatted = [];

            for (const id in groupedResults) {
                formatted.push({
                    id: id,
                    quotes: groupedResults[id].quotes.length,
                });
            }
            
            updateSalespersonData(formatted);
            updateIsLoading(false);
        })();
    }, [date]);

    if (isLoading) return <LoadingScreen />;

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
                                columns={columns as any}
                                data={salespersonData}
                                searchPlaceholder="Buscar por nombre de vendedor..."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
