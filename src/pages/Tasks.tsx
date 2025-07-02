import { useState } from 'react';

import {
    CalendarIcon,
    CheckCircle2,
    ClipboardList,
    Clock,
    Flag,
    Plus,
    Search,
    Users,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import TasksList, { Task } from '@/components/dashboard/TasksList';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Dummy data for tasks
const initialTasks: Task[] = [
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
    {
        id: '6',
        description: 'Preparar presentación para cliente potencial',
        client: 'Grupo Constructor del Norte',
        priority: 'high',
        status: 'pending',
        type: 'proactive-sale',
        dueDate: 'Mañana, 10:00 AM',
    },
    {
        id: '7',
        description:
            'Revisar pedido pendiente y verificar estado de facturación',
        client: 'Distribuidora Comercial',
        orderId: 'VSP-2023-028',
        priority: 'medium',
        status: 'pending',
        dueDate: '23/10/2023',
    },
    {
        id: '8',
        description: 'Enviar catálogo actualizado a cliente',
        client: 'Tecnología Aplicada',
        priority: 'low',
        status: 'pending',
    },
    {
        id: '9',
        description: 'Seguimiento a queja de cliente por demora en entrega',
        client: 'Constructora del Sur',
        priority: 'high',
        status: 'pending',
        dueDate: 'Hoy, 5:00 PM',
    },
    {
        id: '10',
        description: 'Cotizar ampliación de proyecto para cliente existente',
        client: 'Industrias Metálicas',
        priority: 'medium',
        status: 'pending',
        type: 'quotation',
    },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTask, setNewTask] = useState<Partial<Task>>({
        description: '',
        client: '',
        priority: 'medium',
        status: 'pending',
        type: 'follow-up',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCompleteTask = (taskId: string) => {
        setTasks(
            tasks.map((task) =>
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
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleAddTask = () => {
        if (!newTask.description || !newTask.client) {
            return;
        }

        const newTaskId = `task-${Date.now()}`;

        setTasks([
            {
                id: newTaskId,
                description: newTask.description,
                client: newTask.client,
                orderId: newTask.orderId,
                priority: (newTask.priority || 'medium') as
                    | 'high'
                    | 'medium'
                    | 'low',
                status: 'pending',
                type: newTask.type as any,
                dueDate: newTask.dueDate,
            },
            ...tasks,
        ]);

        // Reset form
        setNewTask({
            description: '',
            client: '',
            priority: 'medium',
            status: 'pending',
            type: 'follow-up',
        });

        setIsDialogOpen(false);
    };

    const handleTaskChange = (field: keyof Partial<Task>, value: string) => {
        setNewTask({
            ...newTask,
            [field]: value,
        });
    };

    // Filter tasks based on search query and tab
    const getFilteredTasks = (status?: 'pending' | 'completed') => {
        return tasks.filter((task) => {
            const matchesSearch =
                !searchQuery ||
                task.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                task.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = status ? task.status === status : true;

            return matchesSearch && matchesStatus;
        });
    };

    // Stats calculations
    const pendingTasks = tasks.filter(
        (task) => task.status === 'pending',
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.status === 'completed',
    ).length;

    const highPriorityTasks = tasks.filter(
        (task) => task.priority === 'high' && task.status === 'pending',
    ).length;

    const _quotationTasks = tasks.filter(
        (task) => task.type === 'quotation' && task.status === 'pending',
    ).length;

    const proactiveTasks = tasks.filter(
        (task) => task.type === 'proactive-sale' && task.status === 'pending',
    ).length;

    return (
        <DashboardLayout title="Gestión de Tareas">
            <div className="space-y-8">
                { /* Tasks Stats */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-primary" />
                                Total de Tareas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { tasks.length }
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Activas e históricas
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4 text-warning" />
                                Tareas Pendientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { pendingTasks }
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Requieren acción
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Flag className="h-4 w-4 text-danger" />
                                Alta Prioridad
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { highPriorityTasks }
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Acción inmediata
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-success" />
                                Completadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                { completedTasks }
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Finalizadas con éxito
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card card-hover">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users className="h-4 w-4 text-info" />
                                Venta Proactiva
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-3xl font-bold">
                                { proactiveTasks }
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Oportunidades de venta
                            </div>
                        </CardContent>
                    </Card>
                </div>

                { /* Search and Add Task */ }
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar tareas..."
                            value={ searchQuery }
                            onChange={ (e) => setSearchQuery(e.target.value) }
                            className="pl-10 w-full sm:w-80"
                        />
                    </div>

                    <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Tarea
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Crear nueva tarea</DialogTitle>
                                <DialogDescription>
                                    Completa los detalles para agregar una nueva
                                    tarea a tu lista.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Descripción
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={ newTask.description }
                                        onChange={ (e) =>
                                            handleTaskChange(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Describe la tarea a realizar"
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="client">Cliente</Label>
                                    <Input
                                        id="client"
                                        value={ newTask.client }
                                        onChange={ (e) =>
                                            handleTaskChange(
                                                'client',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nombre del cliente"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="orderId">
                                            ID Orden (opcional)
                                        </Label>
                                        <Input
                                            id="orderId"
                                            value={ newTask.orderId }
                                            onChange={ (e) =>
                                                handleTaskChange(
                                                    'orderId',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ej: COT-2023-001"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="dueDate">
                                            Fecha de Vencimiento
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="dueDate"
                                                value={ newTask.dueDate }
                                                onChange={ (e) =>
                                                    handleTaskChange(
                                                        'dueDate',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Ej: 25/10/2023"
                                                className="pl-10"
                                            />
                                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">
                                            Tipo de Tarea
                                        </Label>
                                        <Select
                                            value={ newTask.type }
                                            onValueChange={ (value) =>
                                                handleTaskChange('type', value)
                                            }
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Seleccionar tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="follow-up">
                                                    Seguimiento
                                                </SelectItem>
                                                <SelectItem value="quotation">
                                                    Cotización
                                                </SelectItem>
                                                <SelectItem value="proactive-sale">
                                                    Venta Proactiva
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">
                                            Prioridad
                                        </Label>
                                        <Select
                                            value={ newTask.priority }
                                            onValueChange={ (value) =>
                                                handleTaskChange(
                                                    'priority',
                                                    value as
                                                        | 'high'
                                                        | 'medium'
                                                        | 'low',
                                                )
                                            }
                                        >
                                            <SelectTrigger id="priority">
                                                <SelectValue placeholder="Seleccionar prioridad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">
                                                    Alta
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Media
                                                </SelectItem>
                                                <SelectItem value="low">
                                                    Baja
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    onClick={ handleAddTask }
                                    disabled={
                                        !newTask.description || !newTask.client
                                    }
                                >
                                    Guardar tarea
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                { /* Tasks List */ }
                <Card className="glass-card card-hover">
                    <CardHeader>
                        <CardTitle>Lista de Tareas</CardTitle>
                        <CardDescription>
                            Gestiona tus tareas pendientes y completadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="pending">
                            <TabsList className="mb-4">
                                <TabsTrigger value="pending">
                                    Pendientes
                                </TabsTrigger>
                                <TabsTrigger value="completed">
                                    Completadas
                                </TabsTrigger>
                                <TabsTrigger value="all">Todas</TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending">
                                <TasksList
                                    tasks={ getFilteredTasks('pending') }
                                    onComplete={ handleCompleteTask }
                                    onDelete={ handleDeleteTask }
                                    showViewAll={ false }
                                />
                            </TabsContent>

                            <TabsContent value="completed">
                                <TasksList
                                    tasks={ getFilteredTasks('completed') }
                                    onComplete={ handleCompleteTask }
                                    onDelete={ handleDeleteTask }
                                    showViewAll={ false }
                                />
                            </TabsContent>

                            <TabsContent value="all">
                                <TasksList
                                    tasks={ getFilteredTasks() }
                                    onComplete={ handleCompleteTask }
                                    onDelete={ handleDeleteTask }
                                    showViewAll={ false }
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
