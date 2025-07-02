import {
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

import { useTheme } from '@/components/theme/ThemeProvider';

import { cn } from '@/lib/utils';

interface RadarChartProps {
    data: any[];
    radarKeys: {
        dataKey: string;
        name: string;
        color: string;
        fillOpacity?: number;
    }[];
    angleAxisKey: string;
    height?: number;
    className?: string;
    showGrid?: boolean;
    showLegend?: boolean;
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

function RadarChart({
    data,
    radarKeys,
    angleAxisKey,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
}: RadarChartProps) {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#d1d5db' : '#374151';

    return (
        <div className={ cn('w-full', className) }>
            <ResponsiveContainer width="100%" height={ height }>
                <RechartsRadarChart
                    data={ data }
                    margin={ {
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 10,
                    } }
                >
                    { showGrid && (
                        <PolarGrid
                            stroke={ theme === 'dark' ? '#4b5563' : '#e5e7eb' }
                        />
                    ) }
                    <PolarAngleAxis
                        dataKey={ angleAxisKey }
                        tick={ { fill: axisColor } }
                    />
                    <PolarRadiusAxis
                        axisLine={ false }
                        tickLine={ false }
                        tick={ { fill: axisColor } }
                    />
                    <Tooltip content={ <CustomTooltip /> } />
                    { showLegend && (
                        <Legend
                            align="center"
                            wrapperStyle={ { color: axisColor } }
                        />
                    ) }

                    { radarKeys.map((radar, index) => (
                        <Radar
                            key={ radar.dataKey }
                            name={ radar.name }
                            dataKey={ radar.dataKey }
                            stroke={ radar.color }
                            fill={ radar.color }
                            fillOpacity={ radar.fillOpacity || 0.2 }
                            animationDuration={ 1500 + index * 200 }
                            animationEasing="ease-out"
                        />
                    )) }
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RadarChart;
