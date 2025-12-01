import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyJWT, AuthUser } from '../utils/jwt';

/*  NO hacemos declare module 'fastify'  */

/* tipo auxiliar para pegar authUser al request  */
export interface RequestWithAuth extends FastifyRequest {
  authUser?: AuthUser;
}

export function requireRole(allowed: AuthUser['role'][]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const hdr = req.headers.authorization;
    if (!hdr) return reply.code(401).send({ error: 'Falta Authorization header' });

    const token = hdr.replace('Bearer ', '');
    try {
      const payload = verifyJWT(token);
      if (!allowed.includes(payload.role))
        return reply.code(403).send({ error: 'Rol no permitido' });

      /* usamos authUser en lugar de user */
      (req as RequestWithAuth).authUser = payload;
    } catch {
      return reply.code(401).send({ error: 'Token inválido o expirado' });
    }
  };
}