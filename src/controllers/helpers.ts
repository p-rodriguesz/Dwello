import { FastifyReply } from 'fastify';

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function databaseUnavailable(reply: FastifyReply) {
  return reply.status(503).send({ error: 'Banco de dados não configurado.' });
}

export function invalidId(reply: FastifyReply) {
  return reply.status(400).send({ error: 'ID inválido.' });
}

export function invalidData(reply: FastifyReply) {
  return reply.status(400).send({ error: 'Dados inválidos.' });
}

export function databaseError(reply: FastifyReply, error: unknown) {
  const code = (error as { code?: string }).code;

  if (code === 'ER_DUP_ENTRY') {
    return reply.status(409).send({ error: 'Já existe um registro com estes dados.' });
  }

  if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_NO_REFERENCED_ROW_2') {
    return reply.status(409).send({ error: 'Relacionamento inválido ou registro em uso.' });
  }

  throw error;
}
