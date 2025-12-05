"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_js_1 = require("../drizzle/db.js");
const drizzle_orm_1 = require("drizzle-orm");
const schema_multi_level_js_1 = require("../drizzle/schema-multi-level.js");
const jwt_js_1 = require("../utils/jwt.js");
// Esquema de validación para login
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// Esquema de validación para registro
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().optional(),
});
async function authRoutes(fastify) {
    // 🔑 LOGIN
    fastify.post('/auth/login', async (request, reply) => {
        try {
            const { email, password } = loginSchema.parse(request.body);
            // Buscar owner por email
            const [user] = await db_js_1.db.select().from(schema_multi_level_js_1.owners).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.owners.email, email));
            if (!user)
                return reply.code(401).send({ error: 'Credenciales inválidas' });
            // Comparar contraseña
            const ok = await bcrypt_1.default.compare(password, user.password);
            if (!ok)
                return reply.code(401).send({ error: 'Credenciales inválidas' });
            // Generar token JWT
            const token = (0, jwt_js_1.signJWT)({
                id: user.id,
                email: user.email,
                role: 'owner',
                ownerId: user.id,
            });
            return {
                message: 'Inicio de sesión exitoso',
                token,
                user: { id: user.id, email: user.email, role: 'owner' },
            };
        }
        catch (err) {
            fastify.log.error(err);
            return reply.code(400).send({ error: 'Error en login' });
        }
    });
    // 📝 REGISTRO
    fastify.post('/auth/register', async (request, reply) => {
        try {
            const { email, password, name, phone } = registerSchema.parse(request.body);
            // Verificar si ya existe
            const [existing] = await db_js_1.db.select().from(schema_multi_level_js_1.owners).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.owners.email, email));
            if (existing)
                return reply.code(400).send({ error: 'Email ya registrado' });
            // Hashear contraseña
            const hashed = await bcrypt_1.default.hash(password, 12);
            // Insertar nuevo owner
            const [newOwner] = await db_js_1.db
                .insert(schema_multi_level_js_1.owners)
                .values({
                email,
                password: hashed,
                name,
                phone,
                status: 'active',
            })
                .returning();
            // Generar token
            const token = (0, jwt_js_1.signJWT)({
                id: newOwner.id,
                email: newOwner.email,
                role: 'owner',
                ownerId: newOwner.id,
            });
            return {
                message: 'Registro exitoso',
                token,
                user: { id: newOwner.id, email: newOwner.email, role: 'owner' },
            };
        }
        catch (err) {
            fastify.log.error(err);
            return reply.code(400).send({ error: 'Error en registro' });
        }
    });
    // 🚪 LOGOUT (ejemplo simple)
    fastify.post('/auth/logout', async (_req, reply) => {
        return reply.send({ message: 'Sesión cerrada' });
    });
}
