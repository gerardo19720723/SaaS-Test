import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../drizzle/db';
import { owners } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { signJWT } from '../utils/jwt';
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
});
export async function registerOwnerRoutes(fastify) {
    fastify.post('/register', async (req, reply) => {
        try {
            const { email, password, name, phone } = registerSchema.parse(req.body);
            // evitar duplicados
            const [existing] = await db.select().from(owners).where(eq(owners.email, email));
            if (existing)
                return reply.code(409).send({ error: 'Email ya registrado' });
            const hashed = await bcrypt.hash(password, 12);
            const [newOwner] = await db.insert(owners).values({
                email,
                password: hashed,
                name,
                phone: phone ?? null,
                status: 'active',
            }).returning();
            const token = signJWT({ id: newOwner.id, role: 'owner', ownerId: newOwner.id });
            return {
                message: 'Owner creado exitosamente',
                token,
                user: { id: newOwner.id, email: newOwner.email, role: 'owner' },
            };
        }
        catch (e) {
            fastify.log.error(e);
            return reply.code(400).send({ error: 'Datos inválidos' });
        }
    });
}
