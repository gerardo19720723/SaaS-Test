"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = require("./routes/index.js");
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({ logger: true });
// ✅ REGISTRAR PLUGINS PRIMERO
async function registerPlugins() {
    await fastify.register(cors_1.default, {
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
    await fastify.register(helmet_1.default);
    await fastify.register(rate_limit_1.default, { max: 100, timeWindow: '1 minute' });
    await fastify.register(jwt_1.default, { secret: process.env.JWT_SECRET || 'tu_secreto_jwt' });
    await fastify.register(cookie_1.default);
}
// ✅ REGISTRAR RUTAS DESPUÉS
async function registerRoutes() {
    await fastify.register(index_js_1.routes, { prefix: '/api' });
    // Health check
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
}
// ✅ FUNCION PRINCIPAL
async function main() {
    const port = parseInt(process.env.PORT || '3000');
    try {
        await registerPlugins();
        await registerRoutes();
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    }
    catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ El puerto ${port} ya está en uso. Cambia PORT en tu .env.`);
        }
        else {
            console.error('Error al iniciar el servidor:', err);
        }
        process.exit(1);
    }
}
main(); // Wed Dec  3 13:06:35 CST 2025
// Wed Dec  3 13:19:06 CST 2025
