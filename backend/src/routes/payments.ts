import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireRole, RequestWithAuth } from '../middleware/roleGuard.js';
import { AuthUser } from '../utils/jwt.js';

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['MXN', 'USD']),
  provider: z.enum(['stripe', 'mercadopago', 'todopago']),
  description: z.string().min(1),
});

export async function paymentRoutes(fastify: FastifyInstance) {
  /* crear pago */
  fastify.post('/create', {
    preHandler: [requireRole(['owner', 'admin_bar', 'customer'])],
  }, async (req: RequestWithAuth, reply) => {
    try {
      const { amount, currency, provider, description } = paymentSchema.parse(req.body);
      const user = req.authUser as AuthUser; // authUser existe gracias al cast

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
    } catch (error) {
      fastify.log.error(error);
      reply.code(400).send({ error: 'Error al crear el pago' });
    }
  });

  /* historial */
  fastify.get('/history', {
    preHandler: [requireRole(['owner', 'admin_bar', 'customer'])],
  }, async (req: RequestWithAuth, reply) => {
    try {
      const user = req.authUser as AuthUser;

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
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Error al obtener historial' });
    }
  });
}