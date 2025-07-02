import { useState } from 'react';
import { Flag, MoreVertical, Users, Bot, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

export interface Task {
    id: string;
    description: string;
    client: string;
    orderId?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'completed';
    type?: 'quotation' | 'follow-up' | 'proactive-sale';
    dueDate?: string;
}

interface TasksListProps {
    tasks: Task[];
    onComplete?: (taskId: string) => void;
    onDelete?: (taskId: string) => void;
    showViewAll?: boolean;
    limit?: number;
}

function PriorityIcon({ priority }: { priority: Task['priority'] }) {
    const iconColor = {
        high: 'text-danger',
        medium: 'text-warning',
        low: 'text-info',
    };

    return <Flag className={ cn('h-4 w-4', iconColor[priority]) } />;
}

function TaskTypeLabel({ type }: { type?: Task['type'] }) {
    if (!type) return null;

    const typeConfig = {
        quotation: { label: 'Cotización', class: 'bg-primary/10 text-primary' },
        'follow-up': {
            label: 'Seguimiento',
            class: 'bg-warning/10 text-warning',
        },
        'proactive-sale': {
            label: 'Venta Proactiva',
            class: 'bg-success/10 text-success',
        },
    };

    return (
        <Badge
            variant="outline"
            className={ cn('text-xs font-normal', typeConfig[type].class) }
        >
            { typeConfig[type].label }
        </Badge>
    );
}

function TasksList({
    tasks,
    onComplete,
    onDelete,
    showViewAll = true,
    limit,
}: TasksListProps) {
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const toggleTaskExpand = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const handleAIFollowUp = async (task: Task) => {
        setIsLoading(task.id);

        try {
            // Replace this URL with your actual webhook URL
            const webhookUrl =
                'https://hooks.zapier.com/hooks/catch/your-webhook-id';

            const _response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'no-cors', // Handle CORS
                body: JSON.stringify({
                    taskId: task.id,
                    client: task.client,
                    description: task.description,
                    type: task.type,
                    timestamp: new Date().toISOString(),
                }),
            });

            toast({
                title: 'Seguimiento AI enviado',
                description: `Se ha programado un seguimiento para ${task.client}`,
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

    const displayTasks = limit ? tasks.slice(0, limit) : tasks;
    const pendingCount = tasks.filter(
        (task) => task.status === 'pending',
    ).length;
    const completedCount = tasks.filter(
        (task) => task.status === 'completed',
    ).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">Tareas Pendientes</h3>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary"
                        >
                            { pendingCount } pendientes
                        </Badge>

                        <Badge
                            variant="outline"
                            className="bg-success/10 text-success"
                        >
                            { completedCount } completadas
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    { showViewAll && tasks.length > (limit || 0) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                        >
                            Ver todas ({ tasks.length })
                        </Button>
                    ) }
                </div>
            </div>

            <div className="space-y-2">
                { displayTasks.map((task) => (
                    <div
                        key={ task.id }
                        className={ cn(
                            'border rounded-lg p-4 transition-all duration-300 card-hover',
                            expandedTaskId === task.id
                                ? 'shadow-md'
                                : 'shadow-sm',
                        ) }
                    >
                        <div className="flex items-start gap-3">
                            <Checkbox
                                checked={ task.status === 'completed' }
                                onCheckedChange={ () => onComplete?.(task.id) }
                                className="mt-1"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <span
                                        className={ cn(
                                            'font-medium line-clamp-2',
                                            task.status === 'completed' &&
                                                'line-through text-muted-foreground',
                                        ) }
                                    >
                                        { task.description }
                                    </span>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <PriorityIcon
                                            priority={ task.priority }
                                        />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Opciones
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={ () =>
                                                        toggleTaskExpand(
                                                            task.id,
                                                        )
                                                    }
                                                >
                                                    { expandedTaskId === task.id
                                                        ? 'Menos detalles'
                                                        : 'Más detalles' }
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={ () =>
                                                        onComplete?.(task.id)
                                                    }
                                                >
                                                    { task.status === 'completed'
                                                        ? 'Marcar como pendiente'
                                                        : 'Marcar como completada' }
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={ () =>
                                                        onDelete?.(task.id)
                                                    }
                                                    className="text-danger"
                                                >
                                                    Eliminar tarea
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>{ task.client }</span>
                                    </div>

                                    { task.orderId && (
                                        <>
                                            <span>•</span>
                                            <span>Pedido: { task.orderId }</span>
                                        </>
                                    ) }

                                    { task.dueDate && (
                                        <>
                                            <span>•</span>
                                            <span>Vence: { task.dueDate }</span>
                                        </>
                                    ) }
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    { task.type && (
                                        <TaskTypeLabel type={ task.type } />
                                    ) }
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={ () => handleAIFollowUp(task) }
                                        disabled={ !!isLoading }
                                        className="gap-2 text-xs h-7 px-2 ml-auto"
                                    >
                                        { isLoading === task.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Bot className="h-3 w-3" />
                                        ) }
                                        AI Follow Up
                                    </Button>
                                </div>

                                { expandedTaskId === task.id && (
                                    <div className="mt-4 pt-3 border-t grid grid-cols-1 gap-3 animate-fade-in">
                                        <Button size="sm" variant="outline">
                                            Sugerir seguimiento
                                        </Button>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </div>
                )) }
            </div>
        </div>
    );
}

export default TasksList;
