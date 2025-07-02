import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Bot, Send } from 'lucide-react';

import ChatMessage, { ChatMessageProps } from './ChatMessage';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

import { useIsMobile } from '@/hooks/useMobile';
import { ChatService } from '@/services/chatService';
import MessageLoading from './MessageLoading';

export interface ChatbotProps {
    position?: 'bottom-right' | 'bottom-left';
}

function Chatbot({ position = 'bottom-right' }: ChatbotProps) {
    const [messages, setMessages] = useState<ChatMessageProps[]>([
        {
            role: 'assistant',
            children: (
                <>
                    ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con
                    tus ventas hoy?
                </>
            ),
            timestamp: new Date(),
        },
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSendMessage() {
        if (!input.trim()) return;

        const userMessage: ChatMessageProps = {
            role: 'user',
            children: <>{ input }</>,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await ChatService.sendMessage(input);

            setMessages((prev) => [
                ...prev,
                {
                    ...response,
                    children: <>{ response.content }</>,
                },
            ]);
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    const positionClasses = {
        'bottom-right': 'right-4 bottom-4',
        'bottom-left': 'left-4 bottom-4',
    };

    function renderChatContent() {
        return (
            <>
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-1.5 rounded-full">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">AI Asistente</h3>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col p-1 space-y-4 max-h-[350px]">
                        { messages.map((message, index) => (
                            <ChatMessage
                                key={ index }
                                role={ message.role }
                                timestamp={ message.timestamp }
                            >
                                { message.children }
                            </ChatMessage>
                        )) }

                        { isLoading && <MessageLoading /> }

                        <div ref={ messagesEndRef } />
                    </div>
                </CardContent>

                <CardFooter className="p-3 border-t">
                    <div className="flex items-center w-full gap-2">
                        <Textarea
                            value={ input }
                            onChange={ (e) => setInput(e.target.value) }
                            onKeyDown={ handleKeyDown }
                            placeholder="Escribe tu mensaje..."
                            className="min-h-10 max-h-32 resize-none"
                            rows={ 1 }
                        />

                        <Button
                            onClick={ handleSendMessage }
                            size="icon"
                            disabled={ isLoading || !input.trim() }
                            className="shrink-0"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </>
        );
    }

    if (isMobile) {
        return (
            <>
                <Drawer open={ isOpen } onOpenChange={ setIsOpen }>
                    <DrawerTrigger asChild>
                        <Button
                            className={ `fixed ${positionClasses[position]} shadow-lg z-50 h-14 w-14 rounded-full` }
                            size="icon"
                        >
                            <Bot className="h-6 w-6" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh]">
                        <div className="h-full flex flex-col">
                            { renderChatContent() }
                        </div>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <>
            <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
                <DialogTrigger asChild>
                    <Button
                        className={ `fixed ${positionClasses[position]} shadow-lg z-50 h-14 w-14 rounded-full` }
                        size="icon"
                    >
                        <Bot className="h-6 w-6" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px] h-[500px] flex flex-col p-0">
                    { renderChatContent() }
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Chatbot;
