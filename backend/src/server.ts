import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { routes } from './routes/index.js';

const fastify = Fastify({ logger: true });

// Registrar JWT con tu secret
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret', // usa variable de entorno en producción
});

//decorator authenticate
fastify.decorate("authenticate", async (request: { jwtVerify: () => any; }, reply: { send: (arg0: unknown) => void; }) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});



// Registrar todas las rutas
fastify.register(routes);

// Arrancar el servidor
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