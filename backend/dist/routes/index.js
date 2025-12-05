import { authRoutes } from './auth.js';
import { paymentRoutes } from './payments.js';
import { registerOwnerRoutes } from './register-owner.js';
import { adminOwnersRoutes } from './admin-owners.js';
export async function routes(fastify) {
    // Rutas públicas (sin JWT)
    await fastify.register(authRoutes, { prefix: '/api' });
    await fastify.register(registerOwnerRoutes, { prefix: '/api' });
    fastify.get('/api/health', async (_req, _reply) => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    // Rutas protegidas (con JWT)
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', async (request, reply) => {
            // Aquí va tu hook JWT (validación de token)
        });
        await fastify.register(adminOwnersRoutes, { prefix: '/api/admin' });
        await fastify.register(paymentRoutes, { prefix: '/api/payments' });
    });
    // 👉 Imprimir todas las rutas registradas al iniciar
    fastify.ready().then(() => {
        console.log(fastify.printRoutes());
    });
}
