import Fastify from 'fastify';
import { routes } from './routes/index.js';

const fastify = Fastify({ logger: true });

// Registrar todas las rutas definidas en index.ts
fastify.register(routes);

// Arrancar el servidor en puerto 3003
fastify.listen({ port: 3003 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Servidor escuchando en ${address}`);
});

// Imprimir todas las rutas registradas al iniciar
fastify.ready().then(() => {
  console.log(fastify.printRoutes());
});