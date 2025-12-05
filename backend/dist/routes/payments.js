"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = paymentRoutes;
const zod_1 = require("zod");
const roleGuard_js_1 = require("../middleware/roleGuard.js");
const paymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(['MXN', 'USD']),
    provider: zod_1.z.enum(['stripe', 'mercadopago', 'todopago']),
    description: zod_1.z.string().min(1),
});
async function paymentRoutes(fastify) {
    /* crear pago */
    fastify.post('/create', {
        preHandler: [(0, roleGuard_js_1.requireRole)(['owner', 'admin', 'customer'])],
    }, async (req, reply) => {
        try {
            const { amount, currency, provider, description } = paymentSchema.parse(req.body);
            const user = req.authUser; // authUser existe gracias al cast
            const payment = {
                id: `pay_${Date.now()}`,
                userId: user.id,
                businessId: user.businessId,
                amount,
                currency,
                provider,
                description,
                status: 'pending',
                checkoutUrl: `https://fake-checkout-${provider}.com/pay_${Date.now()}`,
                createdAt: new Date(),
            };
            reply.code(201).send({ message: 'Pago creado exitosamente', payment });
        }
        catch (error) {
            fastify.log.error(error);
            reply.code(400).send({ error: 'Error al crear el pago' });
        }
    });
    /* historial */
    fastify.get('/history', {
        preHandler: [(0, roleGuard_js_1.requireRole)(['owner', 'admin', 'customer'])],
    }, async (req, reply) => {
        try {
            const user = req.authUser;
            const history = [
                {
                    id: 'pay_123',
                    userId: user.id,
                    amount: 1000,
                    currency: 'ARS',
                    provider: 'stripe',
                    status: 'completed',
                    createdAt: new Date(),
                },
            ];
            reply.send({ payments: history });
        }
        catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Error al obtener historial' });
        }
    });
}
