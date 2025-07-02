import classes from './styles.module.css';

interface LoadingScreenProps {
    text?: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

export default function LoadingScreen({
    text = 'Loading...',
    size = 'large',
    color = '#ff9900',
}: LoadingScreenProps) {
    // Map size to pixel values
    const sizeMap = {
        small: {
            container: 'h-20 w-20',
            spinner: 'w-10 h-10 border-2',
            text: 'text-sm',
        },
        medium: {
            container: 'h-32 w-32',
            spinner: 'w-16 h-16 border-3',
            text: 'text-base',
        },
        large: {
            container: 'h-40',
            spinner: 'w-20 h-20 border-4',
            text: 'text-lg',
        },
    };

    return (
        <div className={ classes.loadingScreenContainer }>
            <div
                className={ `${classes.loadingContainer} ${sizeMap[size].container}` }
            >
                <div
                    className={ `${classes.spinner} ${sizeMap[size].spinner}` }
                    style={ {
                        borderTopColor: color,
                        borderRightColor: color,
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                    } }
                />

                <div
                    className={ classes.pulseCircle }
                    style={ { backgroundColor: color } }
                />

                <div className={ classes.textContainer }>
                    { text && (
                        <p
                            className={ `${classes.loadingText} ${sizeMap[size].text}` }
                        >
                            { text }
                        </p>
                    ) }
                </div>
            </div>
        </div>
    );
}
