import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from 'recharts';

import { useTheme } from '@/components/theme/ThemeProvider';

import { cn } from '@/lib/utils';

interface LineChartProps {
    data: any[];
    xAxisKey: string;
    lines: {
        dataKey: string;
        name: string;
        color: string;
        strokeWidth?: number;
    }[];
    height?: number;
    className?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    targetLine?: {
        value: number;
        label?: string;
    };
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border bg-white p-2 shadow-md text-xs text-gray-800">
                <div className="font-semibold">{ label }</div>
                { payload.map((entry: any, index: number) => (
                    <div
                        key={ `tooltip-${index}` }
                        className="flex items-center gap-2"
                    >
                        <div
                            className="w-3 h-3 rounded"
                            style={ { backgroundColor: entry.color } }
                        ></div>
                        <span className="font-medium">{ entry.name }:</span>
                        <span>{ entry.value.toLocaleString() }</span>
                    </div>
                )) }
            </div>
        );
    }

    return null;
}

function LineChart({
    data,
    xAxisKey,
    lines,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    targetLine,
}: LineChartProps) {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#d1d5db' : '#374151';

    return (
        <div className={ cn('w-full', className) }>
            <ResponsiveContainer width="100%" height={ height }>
                <RechartsLineChart
                    data={ data }
                    margin={ {
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 20,
                    } }
                >
                    { showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            opacity={ 0.2 }
                            stroke={ theme === 'dark' ? '#4b5563' : '#e5e7eb' }
                        />
                    ) }
                    <XAxis
                        dataKey={ xAxisKey }
                        padding={ { left: 10, right: 10 } }
                        tick={ { fill: axisColor } }
                        axisLine={ { stroke: axisColor } }
                        tickLine={ { stroke: axisColor } }
                    />
                    <YAxis
                        tickFormatter={ (value) => value.toLocaleString() }
                        tick={ { fill: axisColor } }
                        axisLine={ { stroke: axisColor } }
                        tickLine={ { stroke: axisColor } }
                    />
                    <Tooltip content={ <CustomTooltip /> } />
                    { showLegend && (
                        <Legend wrapperStyle={ { color: axisColor } } />
                    ) }

                    { targetLine && (
                        <ReferenceLine
                            y={ targetLine.value }
                            stroke={ theme === 'dark' ? '#a78bfa' : '#8884d8' }
                            strokeDasharray="3 3"
                            label={ {
                                value: targetLine.label,
                                position: 'insideBottomRight',
                                fill: axisColor,
                            } }
                        />
                    ) }

                    { lines.map((line, index) => (
                        <Line
                            key={ line.dataKey }
                            type="monotone"
                            dataKey={ line.dataKey }
                            name={ line.name }
                            stroke={ line.color }
                            strokeWidth={ line.strokeWidth || 2 }
                            dot={ { r: 4, strokeWidth: 2 } }
                            activeDot={ { r: 6, strokeWidth: 2 } }
                            animationDuration={ 1500 + index * 200 }
                            animationEasing="ease-out"
                        />
                    )) }
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineChart;
