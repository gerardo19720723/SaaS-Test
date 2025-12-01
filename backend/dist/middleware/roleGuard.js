import { verifyJWT } from '../utils/jwt';
export function requireRole(allowed) {
    return async (req, reply) => {
        const hdr = req.headers.authorization;
        if (!hdr)
            return reply.code(401).send({ error: 'Falta Authorization header' });
        const token = hdr.replace('Bearer ', '');
        try {
            const payload = verifyJWT(token);
            if (!allowed.includes(payload.role))
                return reply.code(403).send({ error: 'Rol no permitido' });
            req.authUser = payload;
        }
        catch {
            return reply.code(401).send({ error: 'Token inválido o expirado' });
        }
    };
}
