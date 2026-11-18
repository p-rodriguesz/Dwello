import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error.js';
import { parseId } from './helpers.js';
import { retrieveFile, uploadDocument, uploadManifestacaoAttachment, uploadSecurityEvidence, uploadVisitorPhoto, uploadPackagePhoto, uploadPaymentReceipt, uploadMaintenanceEvidence } from '../services/upload.service.js';

type IdParams = { id: string };
type DocumentParams = { documentoId: string };
type ManifestationParams = { manifestacaoId: string };
type OccurrenceParams = { ocorrenciaId: string };
type VisitorParams = { visitanteId: string };
type PackageParams = { encomendaId: string };
type PaymentParams = { pagamentoId: string };
type MaintenanceParams = { ordemId: string };

function requiredId(value: string, reply: FastifyReply) {
  const id = parseId(value);
  if (!id) {
    reply.status(400).send({ error: 'ID inválido.', code: 'INVALID_ID' });
    return null;
  }
  return id;
}

async function requiredFile(request: FastifyRequest) {
  const file = await request.file();
  if (!file) throw new AppError(400, 'Arquivo é obrigatório.', 'FILE_REQUIRED');
  return file;
}

export const uploadController = {
  document: async (request: FastifyRequest<{ Params: DocumentParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.documentoId, reply);
    if (!id) return;
    return reply.send(await uploadDocument(request, id, await requiredFile(request)));
  },
  manifestation: async (request: FastifyRequest<{ Params: ManifestationParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.manifestacaoId, reply);
    if (!id) return;
    return reply.status(201).send(await uploadManifestacaoAttachment(request, id, await requiredFile(request)));
  },
  occurrence: async (request: FastifyRequest<{ Params: OccurrenceParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.ocorrenciaId, reply);
    if (!id) return;
    return reply.status(201).send(await uploadSecurityEvidence(request, id, await requiredFile(request)));
  },
  visitorPhoto: async (request: FastifyRequest<{ Params: VisitorParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.visitanteId, reply); if (!id) return;
    return reply.send(await uploadVisitorPhoto(request, id, await requiredFile(request)));
  },
  packagePhoto: async (request: FastifyRequest<{ Params: PackageParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.encomendaId, reply); if (!id) return;
    return reply.send(await uploadPackagePhoto(request, id, await requiredFile(request)));
  },
  paymentReceipt: async (request: FastifyRequest<{ Params: PaymentParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.pagamentoId, reply); if (!id) return;
    return reply.send(await uploadPaymentReceipt(request, id, await requiredFile(request)));
  },
  maintenance: async (request: FastifyRequest<{ Params: MaintenanceParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.ordemId, reply); if (!id) return;
    return reply.status(201).send(await uploadMaintenanceEvidence(request, id, await requiredFile(request)));
  },
  documentFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply);
    if (!id) return;
    const file = await retrieveFile(request, 'documentos', id);
    return reply.type(file.mimetype).header('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`).send(file.stream);
  },
  manifestationFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply);
    if (!id) return;
    const file = await retrieveFile(request, 'anexos_manifestacoes', id);
    return reply.type(file.mimetype).header('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`).send(file.stream);
  },
  occurrenceFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply);
    if (!id) return;
    const file = await retrieveFile(request, 'evidencias_ocorrencias', id);
    return reply.type(file.mimetype).header('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`).send(file.stream);
  },
  visitorPhotoFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply); if (!id) return;
    const file = await retrieveFile(request, 'visitantes', id); return reply.type(file.mimetype).send(file.stream);
  },
  packagePhotoFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply); if (!id) return;
    const file = await retrieveFile(request, 'encomendas', id); return reply.type(file.mimetype).send(file.stream);
  },
  paymentReceiptFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply); if (!id) return;
    const file = await retrieveFile(request, 'pagamentos_fornecedores', id); return reply.type(file.mimetype).send(file.stream);
  },
  maintenanceFile: async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const id = requiredId(request.params.id, reply); if (!id) return;
    const file = await retrieveFile(request, 'evidencias_manutencao', id);
    return reply.type(file.mimetype).header('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`).send(file.stream);
  }
};
