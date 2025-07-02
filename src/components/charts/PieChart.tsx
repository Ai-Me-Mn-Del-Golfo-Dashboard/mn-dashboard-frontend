import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

import { useTheme } from '@/components/theme/ThemeProvider';

import { cn } from '@/lib/utils';

interface PieChartData {
    name: string;
    value: number;
    color?: string;
}

interface PieChartProps {
    data: PieChartData[];
    dataKey?: string;
    nameKey?: string;
    colors?: string[];
    height?: number;
    className?: string;
    showLegend?: boolean;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function CustomTooltip({ active, payload }: any) {
    // TODO: percents don't work
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border bg-white p-2 shadow-md text-xs text-gray-800">
                <div className="font-medium">{ payload[0].name }</div>
                <div className="flex items-center justify-between gap-4">
                    <span>Valor:</span>
                    <span className="font-medium">
                        { payload[0].value.toLocaleString() }
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span>Porcentaje:</span>
                    <span className="font-medium">{ `${(payload[0].percent * 100).toFixed(2)}%` }</span>
                </div>
            </div>
        );
    }

    return null;
}

function PieChart({
    data,
    dataKey = 'value',
    nameKey = 'name',
    colors = COLORS,
    height = 300,
    className,
    showLegend = true,
    innerRadius = 0,
    outerRadius = 80,
    paddingAngle = 0,
}: PieChartProps) {
    const { theme } = useTheme();
    const legendTextColor = theme === 'dark' ? '#d1d5db' : '#374151';

    // Assign colors to data if not already assigned
    const processedData = data.map((item, index) => ({
        ...item,
        color: item.color || colors[index % colors.length],
    }));

    const renderLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        _index,
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text
                x={ x }
                y={ y }
                fill={ theme !== 'dark' ? '#d1d5db' : '#374151' }
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={ 12 }
                fontWeight={ 500 }
            >
                { `${(percent * 100).toFixed(0)}%` }
            </text>
        ) : null;
    };

    // TODO: update border color on pie chart elements
    return (
        <div className={ cn('w-full', className) }>
            <ResponsiveContainer width="100%" height={ height }>
                <RechartsPieChart>
                    <Pie
                        data={ processedData }
                        dataKey={ dataKey }
                        nameKey={ nameKey }
                        innerRadius={ innerRadius }
                        outerRadius={ outerRadius }
                        paddingAngle={ paddingAngle }
                        labelLine={ false }
                        label={ renderLabel }
                        animationDuration={ 1500 }
                        animationEasing="ease-out"
                    >
                        { processedData.map((entry, index) => (
                            <Cell key={ `cell-${index}` } fill={ entry.color } />
                        )) }
                    </Pie>

                    <Tooltip content={ <CustomTooltip /> } />

                    { showLegend && (
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={ 10 }
                            wrapperStyle={ { color: legendTextColor } }
                        />
                    ) }
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PieChart;
