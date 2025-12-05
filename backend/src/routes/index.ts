import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.js';
import { paymentRoutes } from './payments.js';
import { registerOwnerRoutes } from './register-owner.js';
import { adminOwnersRoutes } from './admin-owners.js';

export async function routes(fastify: FastifyInstance) {
  // Rutas públicas
  await fastify.register(authRoutes, { prefix: '/api' });
  await fastify.register(registerOwnerRoutes, { prefix: '/api' });

  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Rutas protegidas (con JWT)
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', async (request, reply) => {
      // Aquí va tu validación JWT
    });

    await fastify.register(adminOwnersRoutes, { prefix: '/api/admin' });
    await fastify.register(paymentRoutes, { prefix: '/api/payments' });
  });
}