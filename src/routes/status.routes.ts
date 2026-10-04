import { FastifyPluginAsync } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../db';

const statusRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_request, reply) => {
    if (!db) {
      return reply.status(503).send({
        api: 'online',
        database: 'not_configured',
        message: 'Defina DATABASE_URL para conectar ao MySQL.'
      });
    }

    try {
      await db.execute(sql`SELECT 1`);

      return reply.status(200).send({
        api: 'online',
        database: 'connected',
        resources: {
          usuarios: '/usuarios'
        }
      });
    } catch {
      return reply.status(503).send({
        api: 'online',
        database: 'unavailable'
      });
    }
  });
};

export default statusRoutes;