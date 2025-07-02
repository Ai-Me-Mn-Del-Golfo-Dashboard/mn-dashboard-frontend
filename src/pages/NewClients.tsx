import { useState, type FormEvent } from 'react';
import { UserPlus, Mail } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DataTable from '@/components/ui/DataTable';

import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import CircularProgress from '@/components/dashboard/CircularProgress';

import { COLOR_MAPPINGS } from '@/lib/constants';

import { useToast } from '@/hooks/useToast';

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

const _clientTypes = [
    { name: 'Nuevos', value: 32 },
    { name: 'Recurrentes', value: 120 },
    { name: 'Inactivos', value: 45 },
];

const sectorDistribution = [
    { name: 'Construcción', value: 40 },
    { name: 'Industrial', value: 25 },
    { name: 'Educación', value: 15 },
    { name: 'Gobierno', value: 12 },
    { name: 'Salud', value: 8 },
];

const newClients = Array.from({ length: 20 }, (_, i) => ({
    id: `CLI-${2000 + i}`,
    name: `Nuevo Cliente ${i + 1}`,
    dateAdded: `${Math.floor(Math.random() * 30) + 1}/10/2023`,
    source: ['Referencia', 'Web', 'Evento', 'Llamada directa', 'Campaña'][
        Math.floor(Math.random() * 5)
    ],
    segment: ['Industrial', 'Comercial', 'Educación', 'Gobierno', 'Salud'][
        Math.floor(Math.random() * 5)
    ],
    email: `cliente${i + 1}@ejemplo.com`,
}));

interface EmailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: string;
    recipientName: string;
}

function EmailDialog({
    isOpen,
    onClose,
    recipient,
    recipientName,
}: EmailDialogProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const webhookUrl = '';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!webhookUrl) {
            toast({
                title: 'En desarrollo',
                description:
                    'La funcionalidad de email será implementada próximamente',
                variant: 'default',
            });
            return;
        }

        setIsLoading(true);

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'no-cors',
                body: JSON.stringify({
                    to: recipient,
                    recipientName: recipientName,
                    subject: subject,
                    message: message,
                    timestamp: new Date().toISOString(),
                }),
            });

            toast({
                title: 'Email enviado',
                description: 'Su email ha sido enviado correctamente',
            });

            setSubject('');
            setMessage('');
            onClose();
        }
        catch (error) {
            console.error('Error sending email:', error);
            toast({
                title: 'Error',
                description:
                    'No se pudo enviar el email. Por favor intente más tarde',
                variant: 'destructive',
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={ isOpen } onOpenChange={ onClose }>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={ handleSubmit }>
                    <DialogHeader>
                        <DialogTitle>Enviar Email</DialogTitle>
                        <DialogDescription>
                            Enviar un email a { recipientName } ({ recipient })
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">
                                Asunto
                            </Label>
                            <Input
                                id="subject"
                                value={ subject }
                                onChange={ (e) => setSubject(e.target.value) }
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="message" className="text-right">
                                Mensaje
                            </Label>
                            <Textarea
                                id="message"
                                value={ message }
                                onChange={ (e) => setMessage(e.target.value) }
                                className="col-span-3"
                                rows={ 6 }
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={ onClose }
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={ isLoading }>
                            { isLoading ? 'Enviando...' : 'Enviar Email' }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function NewClients() {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<{
        name: string;
        email: string;
    } | null>(null);

    const handleEmailClick = (client: { name: string; email: string }) => {
        setSelectedClient(client);
        setEmailDialogOpen(true);
    };

    return (
        <DashboardLayout title="Clientes Nuevos">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
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
                </div>

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
                            <CardTitle>Distribución por Segmento</CardTitle>
                            <CardDescription>
                                Segmentación de clientes nuevos
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
                </div>

                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Listado de Clientes Nuevos</CardTitle>
                        <CardDescription>Últimos 30 días</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={ newClients }
                            columns={ [
                                { header: 'ID', accessorKey: 'id' },
                                { header: 'Cliente', accessorKey: 'name' },
                                {
                                    header: 'Fecha Alta',
                                    accessorKey: 'dateAdded',
                                },
                                { header: 'Origen', accessorKey: 'source' },
                                { header: 'Segmento', accessorKey: 'segment' },
                                {
                                    header: 'Acciones',
                                    accessorKey: 'id',
                                    cell: ({ item }) => (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={ () =>
                                                    handleEmailClick({
                                                        name: item.name,
                                                        email: item.email,
                                                    })
                                                }
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
                    </CardContent>
                </Card>

                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Recomendaciones</CardTitle>
                        <CardDescription>Para clientes nuevos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
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
                                        Implementar programa de referidos para
                                        incrementar captación
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Badge className="mt-0.5 bg-success text-white">
                                        3
                                    </Badge>
                                    <span>
                                        Realizar seguimiento a clientes nuevos
                                        sin primera compra
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            { selectedClient && (
                <EmailDialog
                    isOpen={ emailDialogOpen }
                    onClose={ () => setEmailDialogOpen(false) }
                    recipient={ selectedClient.email }
                    recipientName={ selectedClient.name }
                />
            ) }
        </DashboardLayout>
    );
}
