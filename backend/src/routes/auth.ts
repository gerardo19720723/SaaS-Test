import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../drizzle/db.js';
import { eq } from 'drizzle-orm';
import { owners } from '../drizzle/schema-multi-level.js';
import { signJWT } from '../utils/jwt.js';

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Esquema de validación para registro
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // 🔑 LOGIN
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Buscar owner por email
      const [user] = await db.select().from(owners).where(eq(owners.email, email));
      if (!user) return reply.code(401).send({ error: 'Credenciales inválidas' });

      // Comparar contraseña
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return reply.code(401).send({ error: 'Credenciales inválidas' });

      // Generar token JWT
      const token = signJWT({
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
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: 'Error en login' });
    }
  });

  // 📝 REGISTRO
  fastify.post('/auth/register', async (request, reply) => {
    try {
      const { email, password, name, phone } = registerSchema.parse(request.body);

      // Verificar si ya existe
      const [existing] = await db.select().from(owners).where(eq(owners.email, email));
      if (existing) return reply.code(400).send({ error: 'Email ya registrado' });

      // Hashear contraseña
      const hashed = await bcrypt.hash(password, 12);

      // Insertar nuevo owner
      const [newOwner] = await db
        .insert(owners)
        .values({
          email,
          password: hashed,
          name,
          phone,
          status: 'active',
        })
        .returning();

      // Generar token
      const token = signJWT({
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
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: 'Error en registro' });
    }
  });

  // 🚪 LOGOUT (ejemplo simple)
  fastify.post('/auth/logout', async (_req, reply) => {
    return reply.send({ message: 'Sesión cerrada' });
  });
}