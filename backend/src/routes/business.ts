import { FastifyInstance } from 'fastify';
import { requireRole, RequestWithAuth } from '../middleware/roleGuard.js';
import { db } from '../drizzle/db.js';
import { businesses, staff, customers, loyaltyLevels } from '../drizzle/schema-multi-level.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function businessRoutes(fastify: FastifyInstance) {
  // 📋 Ruta: listar negocios del owner autenticado
  fastify.get('/businesses', { preHandler: requireRole(['owner']) }, async (req, reply) => {
    const authUser = (req as RequestWithAuth).authUser;
    const rows = await db.select().from(businesses).where(eq(businesses.ownerId, authUser!.id));
    return rows;
  });

  // ➕ Ruta: crear un nuevo negocio
  fastify.post('/businesses', { preHandler: requireRole(['owner']) }, async (req, reply) => {
    const authUser = (req as RequestWithAuth).authUser;
    const { name, address, type } = req.body as { name: string; address: string; type: string };

    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name,
        type, // ← obligatorio según tu schema
        address,
        ownerId: authUser!.id!,
        status: 'active',
      })
      .returning();

    return { message: 'Negocio creado', business: newBusiness };
  });

  // ➕ Ruta: crear staff
  fastify.post('/businesses/:businessId/staff', async (req, reply) => {
    try {
      const { businessId } = req.params as { businessId: string };
      const { email, password, name, role, pin } = req.body as {
        email: string;
        password: string;
        name: string;
        role: string;
        pin?: string;
      };

      const [newStaff] = await db.insert(staff).values({
        businessId,
        email,
        password: await bcrypt.hash(password, 10),
        name,
        role,
        pin,
        status: 'active',
      }).returning();

      return { message: 'Staff creado', staff: newStaff };
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: 'Error al crear staff' });
    }
  });

  // 👥 Ruta: listar staff de un negocio
  fastify.get('/businesses/:id/staff', { preHandler: requireRole(['owner']) }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const rows = await db.select().from(staff).where(eq(staff.businessId, id));
    return rows;
  });

  // ➕ Ruta: crear cliente
  fastify.post('/businesses/:businessId/customers', async (req, reply) => {
    try {
      const { businessId } = req.params as { businessId: string };
      const { email, phone, name } = req.body as { email: string; phone: string; name: string };

      const [newCustomer] = await db.insert(customers).values({
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
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: 'Error al crear cliente' });
    }
  });

  // 👤 Ruta: listar clientes de un negocio
  fastify.get('/businesses/:id/customers', async (req, reply) => {
    const { id } = req.params as { id: string };
    const rows = await db.select().from(customers).where(eq(customers.businessId, id));
    return rows;
  });

  // ➕ Ruta: crear nivel de lealtad
fastify.post('/businesses/:businessId/loyalty-levels', { preHandler: requireRole(['owner']) }, async (req, reply) => {
  try {
    const { businessId } = req.params as { businessId: string };
    const { name, minPoints, maxPoints, discountPercentage, benefits, color } = req.body as {
      name: string;
      minPoints?: number;
      maxPoints?: number;
      discountPercentage?: string;
      benefits?: string;
      color?: string;
    };

    const [newLevel] = await db.insert(loyaltyLevels).values({
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
  } catch (err) {
  if (err instanceof Error) {
    console.error(err);
    return reply.status(500).send({ error: 'Error al crear staff', detail: err.message });
  }
  console.error(err);
  return reply.status(500).send({ error: 'Error al crear staff' });
}
});
}