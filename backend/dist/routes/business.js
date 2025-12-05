"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRoutes = businessRoutes;
const roleGuard_js_1 = require("../middleware/roleGuard.js");
const db_js_1 = require("../drizzle/db.js");
const schema_multi_level_js_1 = require("../drizzle/schema-multi-level.js");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function businessRoutes(fastify) {
    // 📋 Ruta: listar negocios del owner autenticado
    fastify.get('/businesses', { preHandler: (0, roleGuard_js_1.requireRole)(['owner']) }, async (req, reply) => {
        const authUser = req.authUser;
        const rows = await db_js_1.db.select().from(schema_multi_level_js_1.businesses).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.businesses.ownerId, authUser.id));
        return rows;
    });
    // ➕ Ruta: crear un nuevo negocio
    fastify.post('/businesses', { preHandler: (0, roleGuard_js_1.requireRole)(['owner']) }, async (req, reply) => {
        const authUser = req.authUser;
        const { name, address, type } = req.body;
        const [newBusiness] = await db_js_1.db
            .insert(schema_multi_level_js_1.businesses)
            .values({
            name,
            type, // ← obligatorio según tu schema
            address,
            ownerId: authUser.id,
            status: 'active',
        })
            .returning();
        return { message: 'Negocio creado', business: newBusiness };
    });
    // ➕ Ruta: crear staff
    fastify.post('/businesses/:businessId/staff', async (req, reply) => {
        try {
            const { businessId } = req.params;
            const { email, password, name, role, pin } = req.body;
            const [newStaff] = await db_js_1.db.insert(schema_multi_level_js_1.staff).values({
                businessId,
                email,
                password: await bcrypt_1.default.hash(password, 10),
                name,
                role,
                pin,
                status: 'active',
            }).returning();
            return { message: 'Staff creado', staff: newStaff };
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: 'Error al crear staff' });
        }
    });
    // 👥 Ruta: listar staff de un negocio
    fastify.get('/businesses/:id/staff', { preHandler: (0, roleGuard_js_1.requireRole)(['owner']) }, async (req, reply) => {
        const { id } = req.params;
        const rows = await db_js_1.db.select().from(schema_multi_level_js_1.staff).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.staff.businessId, id));
        return rows;
    });
    // ➕ Ruta: crear cliente
    fastify.post('/businesses/:businessId/customers', async (req, reply) => {
        try {
            const { businessId } = req.params;
            const { email, phone, name } = req.body;
            const [newCustomer] = await db_js_1.db.insert(schema_multi_level_js_1.customers).values({
                businessId,
                loyaltyLevelId: null, // ⚠️ si tu schema lo requiere, inicialízalo en null
                email,
                phone,
                name,
                points: 0,
                totalSpent: 0,
                visitCount: 0,
                status: 'active',
            }).returning();
            return { message: 'Cliente creado', customer: newCustomer };
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: 'Error al crear cliente' });
        }
    });
    // 👤 Ruta: listar clientes de un negocio
    fastify.get('/businesses/:id/customers', async (req, reply) => {
        const { id } = req.params;
        const rows = await db_js_1.db.select().from(schema_multi_level_js_1.customers).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.customers.businessId, id));
        return rows;
    });
    // ➕ Ruta: crear nivel de lealtad
    fastify.post('/businesses/:businessId/loyalty-levels', { preHandler: (0, roleGuard_js_1.requireRole)(['owner']) }, async (req, reply) => {
        try {
            const { businessId } = req.params;
            const { name, minPoints, maxPoints, discountPercentage, benefits, color } = req.body;
            const [newLevel] = await db_js_1.db.insert(schema_multi_level_js_1.loyaltyLevels).values({
                businessId,
                name,
                minPoints: minPoints ?? 0,
                maxPoints: maxPoints ?? 0,
                discountPercentage: discountPercentage ?? '0%',
                benefits: benefits ?? '',
                color: color ?? '',
                status: 'active',
            }).returning();
            return { message: 'Nivel de lealtad creado', loyaltyLevel: newLevel };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err);
                return reply.status(500).send({ error: 'Error al crear staff', detail: err.message });
            }
            console.error(err);
            return reply.status(500).send({ error: 'Error al crear staff' });
        }
    });
}
