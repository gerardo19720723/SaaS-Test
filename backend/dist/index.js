import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { routes } from './routes/index.js';
dotenv.config();
const fastify = Fastify({ logger: true });
// ✅ REGISTRAR PLUGINS PRIMERO
async function registerPlugins() {
    await fastify.register(cors, {
        origin: (origin, callback) => {
            console.log('🌐 CORS request from:', origin);
            // ✅ Permitir todos estos orígenes de desarrollo
            const allowedOrigins = [
                'http://localhost:4321',
                'http://127.0.0.1:4321',
                'http://[::1]:4321',
                'http://localhost:3000', // Para pruebas locales
                'http://localhost:3001',
                null, // Peticiones directas sin origin
                undefined
            ];
            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS permitido para:', origin);
                callback(null, true);
            }
            else {
                console.log('❌ CORS bloqueado para:', origin);
                console.log('📋 Orígenes permitidos:', allowedOrigins);
                callback(new Error(`CORS: Origen ${origin} no permitido`), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400 // 24 horas
    });
    await fastify.register(helmet);
    await fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });
    await fastify.register(jwt, { secret: process.env.JWT_SECRET || 'tu_secreto_jwt' });
    await fastify.register(cookie);
}
// ✅ REGISTRAR RUTAS DESPUÉS
async function registerRoutes() {
    await fastify.register(routes, { prefix: '/api' });
    // Health check
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
}
// ✅ FUNCION PRINCIPAL
async function main() {
    try {
        await registerPlugins();
        await registerRoutes();
        const port = parseInt(process.env.PORT || '3000');
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    }
    catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
}
main();
