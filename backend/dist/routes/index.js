import { authRoutes } from './auth.js';
import { paymentRoutes } from './payments.js'; // ✅ Agregar import
export async function routes(fastify) {
    // Rutas públicas
    await fastify.register(authRoutes, { prefix: '/auth' });
    // Rutas protegidas
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', async (request, reply) => {
            try {
                console.log('🔐 Verificando token...');
                console.log('📋 Authorization header:', request.headers.authorization);
                // ✅ Permitir token fake en desarrollo
                const authHeader = request.headers.authorization;
                if (authHeader === 'Bearer fake-jwt-token') {
                    console.log('✅ Token fake permitido en desarrollo');
                    // Crear usuario fake para desarrollo
                    request.user = { userId: 'fake-user-id', email: 'fake@user.com' };
                    return;
                }
                // ✅ Verificar token real
                await request.jwtVerify();
                console.log('✅ Token JWT válido');
            }
            catch (err) {
                console.log('❌ Error verificación:', err);
                reply.code(401).send({ error: 'No autorizado' });
            }
        });
        // Rutas protegidas
        await fastify.register(paymentRoutes, { prefix: '/payments' });
    });
}
