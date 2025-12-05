import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { adminRoutes } from './routes/admin.js';
import { authRoutes } from './routes/auth.js';
import { businessRoutes } from './routes/business.js';




const fastify = Fastify({ logger: true });

// Registrar JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
});

// Registrar rutas
fastify.register(authRoutes, { prefix: '/api' });
fastify.register(adminRoutes, { prefix:'/api' });
fastify.register(businessRoutes, { prefix: '/api' });


fastify.listen({ port: 3003 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Servidor escuchando en ${address}`);
});

// Imprimir todas las rutas registradas
fastify.ready().then(() => {
  console.log(fastify.printRoutes());
});