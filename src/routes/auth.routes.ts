import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { auth } from '../lib/auth.js';

export default async function authRoutes(app: FastifyInstance) {
  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      if (!auth) {
        return reply.status(503).send({
          error: 'Autenticação indisponível: configure DATABASE_URL e BETTER_AUTH_SECRET.'
        });
      }

      try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const headers = fromNodeHeaders(request.headers);
        const req = new Request(url, {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {})
        });

        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        app.log.error(error, 'Authentication error');
        return reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE'
        });
      }
    }
  });
}
