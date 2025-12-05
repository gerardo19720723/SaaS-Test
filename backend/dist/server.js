"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const admin_js_1 = require("./routes/admin.js");
const auth_js_1 = require("./routes/auth.js");
const business_js_1 = require("./routes/business.js");
const fastify = (0, fastify_1.default)({ logger: true });
// Registrar JWT
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'supersecret',
});
// Registrar rutas
fastify.register(auth_js_1.authRoutes, { prefix: '/api' });
fastify.register(admin_js_1.adminRoutes, { prefix: '/api' });
fastify.register(business_js_1.businessRoutes, { prefix: '/api' });
fastify.listen({ port: 3003 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`🚀 Servidor escuchando en ${address}`);
});
// Imprimir todas las rutas registradas
fastify.ready().then(() => {
    console.log(fastify.printRoutes());
});
