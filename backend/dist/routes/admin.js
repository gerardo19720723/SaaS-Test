"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const roleGuard_js_1 = require("../middleware/roleGuard.js");
const db_js_1 = require("../drizzle/db.js");
const schema_multi_level_js_1 = require("../drizzle/schema-multi-level.js");
async function adminRoutes(fastify) {
    // 📋 Ruta: listar todos los owners
    fastify.get('/admin/owners', { preHandler: (0, roleGuard_js_1.requireRole)(['admin']) }, async (req, reply) => {
        const authUser = req.authUser;
        fastify.log.info({ authUser }, 'Usuario autenticado en ruta admin');
        const rows = await db_js_1.db.select().from(schema_multi_level_js_1.owners);
        return rows;
    });
    // ➕ Ruta: crear un nuevo owner (ejemplo de admin creando usuarios)
    fastify.post('/admin/owners', { preHandler: (0, roleGuard_js_1.requireRole)(['admin']) }, async (req, reply) => {
        const { email, name, phone, password } = req.body;
        // Aquí podrías validar datos y hashear la contraseña
        // Por simplicidad, lo dejamos como ejemplo
        const [newOwner] = await db_js_1.db
            .insert(schema_multi_level_js_1.owners)
            .values({
            email,
            name,
            phone,
            password, // ⚠️ en producción: usar bcrypt.hash
            status: 'active',
        })
            .returning();
        return { message: 'Owner creado por admin', owner: newOwner };
    });
}
