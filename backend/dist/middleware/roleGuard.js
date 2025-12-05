"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const jwt_js_1 = require("../utils/jwt.js");
function requireRole(allowed) {
    return async (req, reply) => {
        const hdr = req.headers.authorization;
        if (!hdr)
            return reply.code(401).send({ error: 'Falta Authorization header' });
        const token = hdr.replace('Bearer ', '');
        try {
            const payload = (0, jwt_js_1.verifyJWT)(token);
            if (!allowed.includes(payload.role)) {
                return reply.code(403).send({ error: 'Rol no permitido' });
            }
            req.authUser = payload;
        }
        catch {
            return reply.code(401).send({ error: 'Token inválido o expirado' });
        }
    };
}
