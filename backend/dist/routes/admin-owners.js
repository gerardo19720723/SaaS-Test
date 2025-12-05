"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOwnersRoutes = adminOwnersRoutes;
const db_js_1 = require("../drizzle/db.js");
const schema_multi_level_js_1 = require("../drizzle/schema-multi-level.js");
const drizzle_orm_1 = require("drizzle-orm");
async function adminOwnersRoutes(fastify) {
    // Listar todos los owners
    fastify.get('/admin/owners', async (_req, reply) => {
        try {
            const allOwners = await db_js_1.db.select().from(schema_multi_level_js_1.owners);
            fastify.log.info({ count: allOwners.length }, 'Owners listados');
            return allOwners;
        }
        catch (e) {
            fastify.log.error(e, 'Error al listar owners');
            return reply.code(500).send({ error: 'Error al listar owners' });
        }
    });
    // Obtener un owner por ID
    fastify.get('/admin/owners/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const [owner] = await db_js_1.db.select().from(schema_multi_level_js_1.owners).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.owners.id, id));
            if (!owner) {
                return reply.code(404).send({ error: 'Owner no encontrado' });
            }
            fastify.log.info({ owner }, 'Owner encontrado');
            return owner;
        }
        catch (e) {
            fastify.log.error(e, 'Error al obtener owner');
            return reply.code(500).send({ error: 'Error al obtener owner' });
        }
    });
    // Eliminar un owner por ID
    fastify.delete('/admin/owners/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const deleted = await db_js_1.db.delete(schema_multi_level_js_1.owners).where((0, drizzle_orm_1.eq)(schema_multi_level_js_1.owners.id, id)).returning();
            if (deleted.length === 0) {
                return reply.code(404).send({ error: 'Owner no encontrado' });
            }
            fastify.log.info({ deleted }, 'Owner eliminado');
            return { message: 'Owner eliminado exitosamente', owner: deleted[0] };
        }
        catch (e) {
            fastify.log.error(e, 'Error al eliminar owner');
            return reply.code(500).send({ error: 'Error al eliminar owner' });
        }
    });
}
