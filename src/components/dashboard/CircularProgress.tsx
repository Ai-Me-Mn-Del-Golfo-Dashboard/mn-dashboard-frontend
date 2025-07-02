import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
    color?: string;
    className?: string;
    background?: string;
    animate?: boolean;
    title?: string; // Add title prop to interface
}

function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    showValue = true,
    valueFormatter = (val) => `${Math.round(val)}%`,
    color,
    className,
    background = '#e6e6e6',
    animate = true,
    title, // Accept title prop
}: CircularProgressProps) {
    const [progress, setProgress] = useState(0);

    // Calculate percentage
    const percentage = (value / max) * 100;

    // Determine color based on percentage if not provided
    const getColor = () => {
        if (color) return color;

        if (percentage >= 100) return '#0EA5E9'; // Blue for 100% or more
        if (percentage >= 90) return '#10B981'; // Green for 90-99%
        if (percentage >= 70) return '#F59E0B'; // Yellow for 70-89%
        return '#EF4444'; // Red for below 70%
    };

    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Animation effect
    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => {
                setProgress(percentage);
            }, 100);
            return () => clearTimeout(timer);
        }
        else {
            setProgress(percentage);
        }
    }, [percentage, animate]);

    return (
        <div
            className={ cn(
                'relative inline-flex items-center justify-center',
                className,
            ) }
        >
            <svg width={ size } height={ size }>
                { /* Background circle */ }
                <circle
                    cx={ size / 2 }
                    cy={ size / 2 }
                    r={ radius }
                    fill="none"
                    stroke={ background }
                    strokeWidth={ strokeWidth }
                    className="opacity-20"
                />

                { /* Progress circle */ }
                <circle
                    cx={ size / 2 }
                    cy={ size / 2 }
                    r={ radius }
                    fill="none"
                    stroke={ getColor() }
                    strokeWidth={ strokeWidth }
                    strokeDasharray={ circumference }
                    strokeDashoffset={ strokeDashoffset }
                    strokeLinecap="round"
                    transform={ `rotate(-90 ${size / 2} ${size / 2})` }
                    style={ { transition: 'stroke-dashoffset 1s ease-in-out' } }
                />
            </svg>

            { /* Value in center */ }
            { showValue && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">
                        { valueFormatter(value) }
                    </span>
                    { title && (
                        <span className="text-sm text-gray-500">{ title }</span>
                    ) }
                </div>
            ) }
        </div>
    );
}

export default CircularProgress;
