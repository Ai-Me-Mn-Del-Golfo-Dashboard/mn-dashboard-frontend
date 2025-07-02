import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

import { useTheme } from '@/components/theme/ThemeProvider';

import { cn } from '@/lib/utils';

interface BarChartProps {
    data: any[];
    xAxisKey: string;
    bars: {
        dataKey: string;
        name: string;
        color: string;
        stackId?: string;
    }[];
    height?: number;
    className?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    vertical?: boolean;
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

function BarChart({
    data,
    xAxisKey,
    bars,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    vertical = false,
}: BarChartProps) {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#d1d5db' : '#374151';

    return (
        <div className={ cn('w-full', className) }>
            <ResponsiveContainer width="100%" height={ height }>
                <RechartsBarChart
                    data={ data }
                    layout={ vertical ? 'vertical' : 'horizontal' }
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
                            stroke={ theme === 'dark' ? 'white' : '#e5e7eb' }
                        />
                    ) }

                    { vertical ? (
                        <>
                            <XAxis
                                type="number"
                                tickFormatter={ (value) =>
                                    value.toLocaleString()
                                }
                                tick={ { fill: axisColor } }
                                axisLine={ { stroke: axisColor } }
                                tickLine={ { stroke: axisColor } }
                            />

                            <YAxis
                                dataKey={ xAxisKey }
                                type="category"
                                width={ 100 }
                                tick={ { fill: axisColor } }
                                axisLine={ { stroke: axisColor } }
                                tickLine={ { stroke: axisColor } }
                            />
                        </>
                    ) : (
                        <>
                            <XAxis
                                dataKey={ xAxisKey }
                                tick={ { fill: axisColor } }
                                axisLine={ { stroke: axisColor } }
                                tickLine={ { stroke: axisColor } }
                            />

                            <YAxis
                                tickFormatter={ (value) =>
                                    value.toLocaleString()
                                }
                                tick={ { fill: axisColor } }
                                axisLine={ { stroke: axisColor } }
                                tickLine={ { stroke: axisColor } }
                            />
                        </>
                    ) }

                    <Tooltip content={ <CustomTooltip /> } />

                    { showLegend && (
                        <Legend wrapperStyle={ { color: axisColor } } />
                    ) }

                    { bars.map((bar, index) => (
                        <Bar
                            key={ bar.dataKey }
                            dataKey={ bar.dataKey }
                            name={ bar.name }
                            stackId={ bar.stackId }
                            fill={ bar.color }
                            radius={ [4, 4, 0, 0] }
                            animationDuration={ 1000 + index * 200 }
                            animationEasing="ease-out"
                        />
                    )) }
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BarChart;
