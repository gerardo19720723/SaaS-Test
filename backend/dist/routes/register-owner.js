"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOwnerRoutes = registerOwnerRoutes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_js_1 = require("../drizzle/db.js");
const schema_multi_level_js_1 = require("../drizzle/schema-multi-level.js");
const drizzle_orm_1 = require("drizzle-orm");
const registerSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().optional(),
});
async function registerOwnerRoutes(fastify) {
    fastify.post('/owners/register', async (request, reply) => {
        try {
            const { email, password, name, phone } = registerSchema.parse(request.body);
            fastify.log.info({ email, name, phone }, 'Payload recibido en registro');
            // ✅ Uso correcto de eq()
            const existing = await db_js_1.db.select().from(schema_multi_level_js_1.owners).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.owners.email, email));
            if (existing.length > 0) {
                fastify.log.warn(`Registro fallido: email ya registrado ${email}`);
                return reply.code(400).send({ error: 'Email ya registrado' });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 12);
            const [newOwner] = await db_js_1.db.insert(schema_multi_level_js_1.owners).values({
                email,
                password: hashedPassword,
                name,
                phone,
            }).returning();
            return reply.code(201).send({
                message: 'Owner registrado exitosamente',
                owner: { id: newOwner.id, email: newOwner.email, name: newOwner.name },
            });
        }
        catch (e) {
            if (e instanceof zod_1.ZodError) {
                return reply.code(400).send({
                    error: 'Validación fallida',
                    details: e.issues,
                });
            }
            fastify.log.error(e, 'Error inesperado en registro');
            return reply.code(400).send({ error: 'Error en registro' });
        }
    });
}
