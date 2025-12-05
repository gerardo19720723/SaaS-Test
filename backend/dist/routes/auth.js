import bcrypt from 'bcrypt';
import { z, ZodError } from 'zod';
import { db } from '../drizzle/db.js';
import { eq } from 'drizzle-orm';
import { owners } from '../drizzle/schema-multi-level.js';
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export async function authRoutes(fastify) {
    // Login
    fastify.post('/auth/login', async (request, reply) => {
        try {
            // 1. Validación del payload
            const { email, password } = loginSchema.parse(request.body);
            fastify.log.info({ email, password }, 'Payload recibido en login');
            // 2. Buscar owner en DB
            const [user] = await db.select().from(owners).where(eq(owners.email, email));
            fastify.log.info({ user }, 'Resultado de consulta en owners');
            if (!user) {
                fastify.log.warn(`Login fallido: no existe el email ${email}`);
                return reply.code(401).send({ error: 'Credenciales inválidas' });
            }
            // 3. Comparar contraseña
            const ok = await bcrypt.compare(password, user.password);
            fastify.log.info({ ok }, 'Resultado de bcrypt.compare');
            if (!ok) {
                fastify.log.warn(`Login fallido: contraseña incorrecta para ${email}`);
                return reply.code(401).send({ error: 'Credenciales inválidas' });
            }
            // 4. Generar token
            const token = fastify.jwt.sign({
                id: user.id,
                role: 'owner',
                ownerId: user.id,
            });
            fastify.log.info({ token }, 'Token generado');
            return {
                message: 'Inicio de sesión exitoso',
                token,
                user: { id: user.id, email: user.email, role: 'owner' },
            };
        }
        catch (e) {
            if (e instanceof ZodError) {
                fastify.log.error({ issues: e.issues }, 'Error de validación en login');
                return reply.code(400).send({
                    error: 'Validación fallida',
                    details: e.issues,
                });
            }
            fastify.log.error(e, 'Error inesperado en login');
            return reply.code(400).send({ error: 'Error en login' });
        }
    });
    // Logout
    fastify.post('/auth/logout', async (_req, reply) => {
        reply.send({ message: 'Sesión cerrada exitosamente' });
    });
}
