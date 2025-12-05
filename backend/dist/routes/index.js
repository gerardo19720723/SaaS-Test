"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const auth_js_1 = require("./auth.js");
const payments_js_1 = require("./payments.js");
const register_owner_js_1 = require("./register-owner.js");
const admin_owners_js_1 = require("./admin-owners.js");
async function routes(fastify) {
    // Rutas públicas
    await fastify.register(auth_js_1.authRoutes, { prefix: '/api' });
    await fastify.register(register_owner_js_1.registerOwnerRoutes, { prefix: '/api' });
    fastify.get('/api/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    // Rutas protegidas (con JWT)
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', async (request, reply) => {
            // Aquí va tu validación JWT
        });
        await fastify.register(admin_owners_js_1.adminOwnersRoutes, { prefix: '/api/admin' });
        await fastify.register(payments_js_1.paymentRoutes, { prefix: '/api/payments' });
    });
}
