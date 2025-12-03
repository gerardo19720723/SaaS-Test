import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../drizzle/db';
import { eq } from 'drizzle-orm';
import { owners } from '../drizzle/schema-multi-level';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ✅ Export nombrado correcto
export async function authRoutes(fastify: FastifyInstance) {
  
  // Registro de usuario
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password, name } = registerSchema.parse(request.body);
      
      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Aquí iría la lógica para guardar en DB
      // Por ahora, simulamos éxito
      
      reply.code(201).send({
        message: 'Usuario registrado exitosamente',
        user: {
          email,
          name: name || email.split('@')[0],
        },
      });
    } catch (error) {
      reply.code(400).send({ error: 'Error en el registro' });
    }
  });

  // Inicio de sesión
 fastify.post('/login', async (request, reply) => {
  try {
    const { email, password } = loginSchema.parse(request.body);

    // Buscar usuario real
    const [user] = await db.select().from(owners).where(eq(owners.email, email));
    if (!user) return reply.code(401).send({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.code(401).send({ error: 'Credenciales inválidas' });

    // Firmar JWT real
    const token = fastify.jwt.sign({ id: user.id, role: 'owner', ownerId: user.id });
    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, email: user.email, role: 'owner' },
    };
  } catch (e) {
    fastify.log.error(e);
    return reply.code(400).send({ error: 'Error en login' });
  }
});

  // Cierre de sesión
  fastify.post('/logout', async (request, reply) => {
    reply.send({ message: 'Sesión cerrada exitosamente' });
  });

}