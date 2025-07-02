import { toast } from 'sonner';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// This class will handle chat functionality and can be expanded to connect to your actual database
export class ChatService {
    private static exampleResponses: Record<string, string> = {
        ventas: 'En el mes actual, tenemos 52 cotizaciones activas por un valor total de $283,500 MXN. Las ventas proyectadas para este mes son un 15% superiores al mismo período del año pasado.',
        cliente:
            'El cliente Constructora Moderna tiene 3 cotizaciones pendientes y ha comprado productos por $185,000 MXN en los últimos 6 meses. Su último contacto fue hace 12 días.',
        tarea: 'Tienes 8 tareas pendientes de alta prioridad, incluidas 3 cotizaciones por dar seguimiento y 2 clientes que necesitan ser contactados hoy.',
        cotización:
            'La cotización #COT-2023-089 para Constructora Moderna incluye 12 productos por un valor total de $45,800 MXN. Fue enviada hace 3 días y aún no ha sido aprobada.',
        meta: 'Tu meta mensual es de $500,000 MXN en ventas y has alcanzado el 56% hasta ahora. Necesitas $220,000 MXN adicionales para cumplir tu objetivo este mes.',
        pedido: 'El pedido VSP-2023-112 para Muebles Modernos está pendiente de facturación. Incluye 8 productos y tiene un valor de $28,500 MXN.',
        default:
            'Puedo asistirte con información sobre tus ventas, clientes, cotizaciones, pedidos y tareas pendientes. ¿Qué información necesitas?',
    };

    // This method would connect to your database in a real implementation
    public static async sendMessage(message: string): Promise<ChatMessage> {
        try {
            // Simplified response logic - in a real implementation, this would query your database
            const lowerMessage = message.toLowerCase();
            let responseContent = this.exampleResponses.default;

            for (const [keyword, response] of Object.entries(
                this.exampleResponses,
            )) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    responseContent = response;
                    break;
                }
            }

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return {
                role: 'assistant',
                content: responseContent,
                timestamp: new Date(),
            };
        }
        catch (error) {
            toast.error('No se pudo enviar el mensaje. Intente de nuevo.');
            throw error;
        }
    }
}
