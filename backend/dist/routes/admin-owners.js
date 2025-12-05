import { db } from '../drizzle/db.js';
import { owners } from '../drizzle/schema-multi-level.js';
import { eq } from 'drizzle-orm';
export async function adminOwnersRoutes(fastify) {
    // Listar todos los owners
    fastify.get('/admin/owners', async (_req, reply) => {
        try {
            const allOwners = await db.select().from(owners);
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
            const [owner] = await db.select().from(owners).where(eq(owners.id, id));
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
            const deleted = await db.delete(owners).where(eq(owners.id, id)).returning();
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
