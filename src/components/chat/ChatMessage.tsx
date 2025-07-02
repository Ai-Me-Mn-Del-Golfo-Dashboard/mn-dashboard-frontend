import { PropsWithChildren } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'assistant';

export type ChatMessageProps = PropsWithChildren & {
    role: MessageRole;
    timestamp?: Date;
};

function ChatMessage({
    children,
    role,
    timestamp = new Date(),
}: ChatMessageProps) {
    const isUser = role === 'user';

    return (
        <div
            className={ cn(
                'flex gap-3 p-4 max-w-full',
                isUser ? 'flex-row-reverse' : 'flex-row',
            ) }
        >
            <div
                className={ cn(
                    'flex items-center justify-center h-9 w-9 rounded-full shrink-0',
                    isUser ? 'bg-primary' : 'bg-primary/20',
                ) }
            >
                { isUser ? (
                    <User className="h-5 w-5 text-primary-foreground" />
                ) : (
                    <Bot className="h-5 w-5 text-primary" />
                ) }
            </div>

            <div
                className={ cn(
                    'relative rounded-lg px-4 py-3 max-w-[80%]',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground',
                ) }
            >
                <p className="whitespace-pre-wrap break-words text-sm">
                    { children }
                </p>

                <div
                    className={ cn(
                        'text-xs opacity-70 mt-1',
                        isUser
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground',
                    ) }
                >
                    { timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }) }
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
