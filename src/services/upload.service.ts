import { createReadStream } from 'node:fs';
import { mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';
import type { MultipartFile } from '@fastify/multipart';
import { AppError } from '../errors/app-error.js';
import { env } from '../config/env.js';
import { authorizeResource } from '../auth/rbac.js';
import { createDwello, getDwello, updateDwello } from './dwello.service.js';
import type { DwelloResource } from './dwello.service.js';

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const allowedTypes: Record<string, string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.pdf': ['application/pdf']
};

type UploadTarget = 'documentos' | 'anexos_manifestacoes' | 'evidencias_ocorrencias' | 'visitantes' | 'encomendas' | 'pagamentos_fornecedores';

function fileExtension(filename: string) {
  return path.extname(path.basename(filename)).toLowerCase();
}

function validateFile(file: MultipartFile) {
  const extension = fileExtension(file.filename);
  const accepted = allowedTypes[extension];
  if (!accepted || !accepted.includes(file.mimetype.toLowerCase())) {
    throw new AppError(415, 'Extensão e MIME type do arquivo não são permitidos.', 'UNSUPPORTED_FILE_TYPE');
  }
  return extension;
}

function targetResource(target: UploadTarget): DwelloResource {
  return target;
}

function filePath(fileUrl: string) {
  const prefix = '/uploads/';
  if (!fileUrl.startsWith(prefix)) throw new AppError(404, 'Arquivo não encontrado.', 'FILE_NOT_FOUND');
  const key = fileUrl.slice(prefix.length);
  const root = path.resolve(env.uploadDir);
  const resolved = path.resolve(root, key);
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new AppError(404, 'Arquivo não encontrado.', 'FILE_NOT_FOUND');
  }
  return resolved;
}

async function persistFile(file: MultipartFile, condominiumId: number, target: UploadTarget) {
  const extension = validateFile(file);
  const now = new Date();
  const key = path.posix.join(String(condominiumId), target, String(now.getUTCFullYear()), String(now.getUTCMonth() + 1).padStart(2, '0'), `${randomUUID()}${extension}`);
  const destination = path.resolve(env.uploadDir, ...key.split('/'));
  await mkdir(path.dirname(destination), { recursive: true });
  try {
    await pipeline(file.file, (await import('node:fs')).createWriteStream(destination));
    if (file.file.truncated) throw new AppError(413, 'Arquivo excede o tamanho máximo permitido.', 'FILE_TOO_LARGE');
    return { url: `/uploads/${key}`, filename: path.basename(file.filename), mimetype: file.mimetype };
  } catch (error) {
    await rm(destination, { force: true });
    throw error;
  }
}

async function parentCondominium(request: Parameters<typeof authorizeResource>[0], resource: DwelloResource, id: number) {
  const row = await getDwello(resource, id, [], true) as Record<string, unknown> | undefined;
  if (!row) throw new AppError(404, 'Registro associado não encontrado.', 'PARENT_NOT_FOUND');
  const condominiumId = Number(row.condominioId);
  if (!Number.isSafeInteger(condominiumId) || condominiumId <= 0) throw new AppError(422, 'Registro associado não possui condomínio válido.', 'INVALID_CONDOMINIUM');
  return { row, condominiumId };
}

export async function uploadDocument(request: Parameters<typeof authorizeResource>[0], documentId: number, file: MultipartFile) {
  const { row, condominiumId } = await parentCondominium(request, 'documentos', documentId);
  await authorizeResource(request, 'documentos', 'update', condominiumId);
  const stored = await persistFile(file, condominiumId, 'documentos');
  try {
    const updated = await updateDwello('documentos', documentId, { arquivoUrl: stored.url }, [condominiumId]);
    const previousUrl = typeof row.arquivoUrl === 'string' ? row.arquivoUrl : '';
    if (updated && previousUrl && previousUrl !== stored.url) {
      await rm(filePath(previousUrl), { force: true }).catch(() => undefined);
    }
    return updated;
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function uploadManifestacaoAttachment(request: Parameters<typeof authorizeResource>[0], manifestationId: number, file: MultipartFile) {
  const { condominiumId } = await parentCondominium(request, 'manifestacoes', manifestationId);
  await authorizeResource(request, 'manifestacoes', 'update', condominiumId);
  await authorizeResource(request, 'anexos_manifestacoes', 'create', condominiumId);
  const stored = await persistFile(file, condominiumId, 'anexos_manifestacoes');
  try {
    return await createDwello('anexos_manifestacoes', { condominioId: condominiumId, manifestacaoId: manifestationId, arquivoUrl: stored.url, nomeArquivo: stored.filename });
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function uploadSecurityEvidence(request: Parameters<typeof authorizeResource>[0], occurrenceId: number, file: MultipartFile) {
  const { condominiumId } = await parentCondominium(request, 'ocorrencias_seguranca', occurrenceId);
  await authorizeResource(request, 'ocorrencias_seguranca', 'update', condominiumId);
  await authorizeResource(request, 'evidencias_ocorrencias', 'create', condominiumId);
  const stored = await persistFile(file, condominiumId, 'evidencias_ocorrencias');
  try {
    return await createDwello('evidencias_ocorrencias', { condominioId: condominiumId, ocorrenciaId: occurrenceId, arquivoUrl: stored.url, tipo: stored.mimetype });
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function uploadVisitorPhoto(request: Parameters<typeof authorizeResource>[0], visitorId: number, file: MultipartFile) {
  const { row, condominiumId } = await parentCondominium(request, 'visitantes', visitorId);
  await authorizeResource(request, 'visitantes', 'update', condominiumId);
  const stored = await persistFile(file, condominiumId, 'visitantes');
  try {
    const updated = await updateDwello('visitantes', visitorId, { fotoUrl: stored.url }, [condominiumId]);
    const previousUrl = typeof row.fotoUrl === 'string' ? row.fotoUrl : '';
    if (updated && previousUrl && previousUrl !== stored.url) await rm(filePath(previousUrl), { force: true }).catch(() => undefined);
    return updated;
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function uploadPackagePhoto(request: Parameters<typeof authorizeResource>[0], packageId: number, file: MultipartFile) {
  const { row, condominiumId } = await parentCondominium(request, 'encomendas', packageId);
  await authorizeResource(request, 'encomendas', 'update', condominiumId);
  const stored = await persistFile(file, condominiumId, 'encomendas');
  try {
    const updated = await updateDwello('encomendas', packageId, { fotoUrl: stored.url }, [condominiumId]);
    const previousUrl = typeof row.fotoUrl === 'string' ? row.fotoUrl : '';
    if (updated && previousUrl && previousUrl !== stored.url) await rm(filePath(previousUrl), { force: true }).catch(() => undefined);
    return updated;
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function uploadPaymentReceipt(request: Parameters<typeof authorizeResource>[0], paymentId: number, file: MultipartFile) {
  const { row, condominiumId } = await parentCondominium(request, 'pagamentos_fornecedores', paymentId);
  await authorizeResource(request, 'pagamentos_fornecedores', 'update', condominiumId);
  const stored = await persistFile(file, condominiumId, 'pagamentos_fornecedores');
  try {
    const updated = await updateDwello('pagamentos_fornecedores', paymentId, { comprovanteUrl: stored.url }, [condominiumId]);
    const previousUrl = typeof row.comprovanteUrl === 'string' ? row.comprovanteUrl : '';
    if (updated && previousUrl && previousUrl !== stored.url) await rm(filePath(previousUrl), { force: true }).catch(() => undefined);
    return updated;
  } catch (error) {
    await rm(filePath(stored.url), { force: true });
    throw error;
  }
}

export async function retrieveFile(request: Parameters<typeof authorizeResource>[0], target: UploadTarget, id: number) {
  const row = await getDwello(target, id, [], true) as Record<string, unknown> | undefined;
  if (!row) throw new AppError(404, 'Arquivo não encontrado.', 'FILE_NOT_FOUND');
  const condominiumId = Number(row.condominioId);
  await authorizeResource(request, targetResource(target), 'read', condominiumId);
  const urlKey = target === 'pagamentos_fornecedores' ? 'comprovanteUrl' : target === 'visitantes' || target === 'encomendas' ? 'fotoUrl' : 'arquivoUrl';
  const url = String(row[urlKey] ?? '');
  const absolute = filePath(url);
  try {
    await stat(absolute);
  } catch {
    throw new AppError(404, 'Arquivo não encontrado.', 'FILE_NOT_FOUND');
  }
  const extension = fileExtension(url);
  const mimetype = Object.entries(allowedTypes).find(([key]) => key === extension)?.[1][0] ?? 'application/octet-stream';
  return { stream: createReadStream(absolute), mimetype, filename: row.nomeArquivo ? String(row.nomeArquivo) : path.basename(absolute) };
}
