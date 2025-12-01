import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../drizzle/db';

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
      
      // Aquí iría la lógica de autenticación
      // Por ahora, simulamos éxito
      
      reply.send({
        message: 'Inicio de sesión exitoso',
        token: 'fake-jwt-token',
        user: {
          email,
          name: email.split('@')[0],
        },
      });
    } catch (error) {
      reply.code(400).send({ error: 'Error en el inicio de sesión' });
    }
  });

  // Cierre de sesión
  fastify.post('/logout', async (request, reply) => {
    reply.send({ message: 'Sesión cerrada exitosamente' });
  });

}