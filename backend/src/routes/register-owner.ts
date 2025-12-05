import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z, ZodError } from 'zod';
import { db } from '../drizzle/db.js';
import { owners } from '../drizzle/schema-multi-level.js';
import { eq } from 'drizzle-orm';

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export async function registerOwnerRoutes(fastify: FastifyInstance) {
  fastify.post('/owners/register', async (request, reply) => {
    try {
      const { email, password, name, phone } = registerSchema.parse(request.body);
      fastify.log.info({ email, name, phone }, 'Payload recibido en registro');

      // ✅ Uso correcto de eq()
      const existing = await db.select().from(owners).where(eq(owners.email, email));
      if (existing.length > 0) {
        fastify.log.warn(`Registro fallido: email ya registrado ${email}`);
        return reply.code(400).send({ error: 'Email ya registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const [newOwner] = await db.insert(owners).values({
        email,
        password: hashedPassword,
        name,
        phone,
      }).returning();

      return reply.code(201).send({
        message: 'Owner registrado exitosamente',
        owner: { id: newOwner.id, email: newOwner.email, name: newOwner.name },
      });
    } catch (e) {
      if (e instanceof ZodError) {
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