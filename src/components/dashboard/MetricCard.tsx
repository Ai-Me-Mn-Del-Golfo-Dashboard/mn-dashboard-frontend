import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/components/theme/ThemeProvider';

import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface MetricCardProps {
    title: string;
    value: string | number;
    target?: string | number;
    description?: string;
    icon?: ReactNode;
    chart?: ReactNode;
    footer?: ReactNode;
    detailsLink?: string;
    detailsLabel?: string;
    loading?: boolean;
    className?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    secondValue?: ReactNode;
    secondTrend?: { value: number; isPositive: boolean };
}

function MetricCard({
    title,
    value,
    target,
    description,
    icon,
    chart,
    footer,
    detailsLink,
    detailsLabel = 'Ver más detalles',
    loading = false,
    className,
    trend,
    secondValue,
    secondTrend,
}: MetricCardProps) {
    const { theme } = useTheme();

    function renderMetric(
        displayValue: ReactNode,
        displayTrend?: { value: number; isPositive: boolean },
        alignCenter = false,
    ) {
        return (
            <div className={ cn('space-y-1', alignCenter && 'text-center') }>
                <div
                    className={ cn(
                        'text-3xl font-bold tracking-tight dark:text-white',
                        alignCenter && 'text-4xl',
                    ) }
                >
                    { displayValue }
                </div>
                { displayTrend && (
                    <div
                        className={ cn(
                            'text-xs flex items-center',
                            displayTrend.isPositive
                                ? 'text-success dark:text-green-400'
                                : 'text-danger dark:text-red-400',
                            alignCenter && 'justify-center',
                        ) }
                    >
                        { displayTrend.isPositive ? '↑' : '↓' }{ ' ' }
                        { displayTrend.value }% vs mes anterior
                    </div>
                ) }
            </div>
        );
    }

    if (loading) {
        return (
            <Card className={ cn('overflow-hidden card-hover', className) }>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48" />

                        { icon && <Skeleton className="h-8 w-8 rounded-full" /> }
                    </CardTitle>

                    { description && <Skeleton className="h-4 w-32 mt-1" /> }
                </CardHeader>

                <CardContent>
                    <Skeleton className="h-16 w-full mb-6" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={ cn(
                'overflow-hidden card-hover',
                theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'glass-card',
                className,
            ) }
        >
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-foreground dark:text-white">
                    <span>{ title }</span>
                    { icon }
                </CardTitle>

                { description && (
                    <CardDescription className="dark:text-gray-300">
                        { description }
                    </CardDescription>
                ) }

                { target !== undefined && (
                    <div
                        className={ cn(
                            'text-xs',
                            theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-muted-foreground',
                        ) }
                    >
                        Objetivo: <span className="font-medium">{ target }</span>
                    </div>
                ) }
            </CardHeader>

            <CardContent>
                <div
                    className={ cn(
                        'flex w-full items-center py-4 px-8',
                        chart ? 'justify-between' : 'justify-center',
                    ) }
                >
                    { secondValue !== undefined ? (
                        <div className="flex flex-col w-full space-y-3">
                            <div className="flex justify-around items-start">
                                { renderMetric(value, trend, true) }
                                { renderMetric(secondValue, secondTrend, true) }
                            </div>

                            { chart && <div className="mt-4">{ chart }</div> }
                        </div>
                    ) : (
                        <>
                            { renderMetric(value, trend, !chart) }

                            { chart && <div>{ chart }</div> }
                        </>
                    ) }
                </div>

                { footer && (
                    <div
                        className={ cn(
                            'mt-4 text-sm',
                            theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-muted-foreground',
                        ) }
                    >
                        { footer }
                    </div>
                ) }
            </CardContent>

            { detailsLink && (
                <CardFooter className="pt-0 pb-4">
                    <Button
                        variant="link"
                        className="px-0 h-auto text-primary dark:text-blue-400 flex items-center"
                        asChild
                    >
                        <Link to={ detailsLink }>
                            { detailsLabel }{ ' ' }
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            ) }
        </Card>
    );
}

export default MetricCard;
