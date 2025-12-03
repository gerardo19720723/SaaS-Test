import { authRoutes } from './auth.js';
import { paymentRoutes } from './payments.js';
import { registerOwnerRoutes } from './register-owner.js';
import { adminOwnersRoutes } from './admin-owners';
export async function routes(fastify) {
    // Rutas públicas (sin JWT)
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(registerOwnerRoutes, { prefix: '/owner' });
    fastify.get('/admin/health', async (request, reply) => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    // Rutas protegidas (con JWT)
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', async (request, reply) => {
            // tu hook JWT
        });
        await fastify.register(adminOwnersRoutes); // → /admin/owners
        await fastify.register(paymentRoutes, { prefix: '/payments' });
    });
}
