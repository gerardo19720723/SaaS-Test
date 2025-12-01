import { z } from 'zod';
const paymentSchema = z.object({
    amount: z.number().positive(),
    currency: z.enum(['ARS', 'USD', 'BRL']),
    provider: z.enum(['stripe', 'mercadopago', 'todopago']),
    description: z.string().min(1),
});
export async function paymentRoutes(fastify) {
    // Crear pago
    fastify.post('/create', async (request, reply) => {
        try {
            console.log('🚀 Headers recibidos:', request.headers);
            console.log('🔑 Authorization:', request.headers.authorization);
            console.log('👤 User:', request.user);
            // Obtener usuario (fake o real)
            const userId = request.user?.userId || 'fake-user-id';
            console.log('👤 User ID usado:', userId);
            const { amount, currency, provider, description } = paymentSchema.parse(request.body);
            console.log('💳 Creando pago:', { amount, currency, provider, description, userId });
            // Crear pago fake
            const payment = {
                id: 'pay_' + Date.now(),
                userId,
                amount,
                currency,
                provider,
                description,
                status: 'pending',
                checkoutUrl: `https://fake-checkout-${provider}.com/pay_${Date.now()}`,
                createdAt: new Date(),
            };
            console.log('✅ Pago creado:', payment);
            reply.code(201).send({
                message: 'Pago creado exitosamente',
                payment: payment
            });
        }
        catch (error) {
            console.log('❌ Error creando pago:', error);
            reply.code(400).send({ error: 'Error al crear el pago' });
        }
    });
    // Obtener historial de pagos
    fastify.get('/history', async (request, reply) => {
        try {
            const { userId } = request.user;
            // Simular historial
            const history = [
                {
                    id: 'pay_123',
                    amount: 1000,
                    currency: 'ARS',
                    provider: 'stripe',
                    status: 'completed',
                    createdAt: new Date()
                }
            ];
            reply.send({ payments: history });
        }
        catch (error) {
            reply.code(500).send({ error: 'Error al obtener historial' });
        }
    });
}
