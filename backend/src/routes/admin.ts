import { FastifyInstance } from 'fastify';
import { requireRole, RequestWithAuth } from '../middleware/roleGuard.js';
import { db } from '../drizzle/db.js';
import { owners } from '../drizzle/schema-multi-level.js';

export async function adminRoutes(fastify: FastifyInstance) {
  // 📋 Ruta: listar todos los owners
  fastify.get('/admin/owners', { preHandler: requireRole(['admin']) }, async (req, reply) => {
    const authUser = (req as RequestWithAuth).authUser;
    fastify.log.info({ authUser }, 'Usuario autenticado en ruta admin');

    const rows = await db.select().from(owners);
    return rows;
  });

  // ➕ Ruta: crear un nuevo owner (ejemplo de admin creando usuarios)
  fastify.post('/admin/owners', { preHandler: requireRole(['admin']) }, async (req, reply) => {
    const { email, name, phone, password } = req.body as any;

    // Aquí podrías validar datos y hashear la contraseña
    // Por simplicidad, lo dejamos como ejemplo
    const [newOwner] = await db
      .insert(owners)
      .values({
        email,
        name,
        phone,
        password, // ⚠️ en producción: usar bcrypt.hash
        status: 'active',
      })
      .returning();

    return { message: 'Owner creado por admin', owner: newOwner };
  });
}