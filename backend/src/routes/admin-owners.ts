import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../drizzle/db';
import { owners } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { requireRole } from '../middleware/roleGuard';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export async function adminOwnersRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireRole(['owner', 'admin_bar']));

  // LISTAR owners
  fastify.get('/admin/owners', async (req, reply) => {
    const list = await db.select().from(owners);
    return list;
  });

  // CREAR owner
  fastify.post('/admin/owners', async (req, reply) => {
    const { email, password, name, phone } = createSchema.parse(req.body);
    const [exists] = await db.select().from(owners).where(eq(owners.email, email));
    if (exists) return reply.code(409).send({ error: 'Email ya existe' });

    const hashed = await bcrypt.hash(password, 12);
    const [row] = await db.insert(owners).values({
      email, password: hashed, name, phone: phone ?? null, status: 'active',
    }).returning();
    return { message: 'Owner creado', owner: row };
  });

  // BORRAR owner
  fastify.delete('/admin/owners/:id', async (req, reply) => {
    const { id } = req.params as { id:string };
    await db.delete(owners).where(eq(owners.id, id));
    return { message: 'Owner eliminado' };
  });
}