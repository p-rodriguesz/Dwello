import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { app } from '../src/app';
import { pool } from '../src/db';
import { env } from '../src/config/env';

describe('autenticação e RBAC', () => {
  const suffix = Date.now();
  const email = `admin.${suffix}@example.com`;
  const password = 'senha-segura-123';
  const origin = 'http://localhost:3000';
  const ids: Record<string, number> = {};
  let cookie = '';
  const headers = () => ({ origin, cookie });
  const multipart = (filename: string, contentType: string, value: Buffer) => {
    const boundary = `----dwello-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const prefix = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`);
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
    return { body: Buffer.concat([prefix, value, suffix]), contentType: `multipart/form-data; boundary=${boundary}` };
  };
  const readCookie = (response: { headers: Record<string, string | string[] | undefined> }) => {
    const value = response.headers['set-cookie'];
    return (Array.isArray(value) ? value : [value]).filter(Boolean).map((item) => item!.split(';')[0]).join('; ');
  };

  before(async () => {
    await app.ready();
    const signup = await app.inject({ method: 'POST', url: '/api/auth/sign-up/email', headers: { origin }, payload: { name: 'Admin', email, password } });
    assert.equal(signup.statusCode, 200, signup.body);
    cookie = readCookie(signup);
    const profile = await app.inject({ method: 'GET', url: `/usuarios?q=${email}`, headers: headers() });
    assert.equal(profile.statusCode, 403);
    const [rows] = await pool!.query<{ id: number }[]>('SELECT id FROM usuarios WHERE email = ?', [email]);
    ids.usuario = rows[0].id;
    await pool!.query('INSERT INTO usuario_perfis (usuario_id, condominio_id, perfil) VALUES (?, NULL, ?)', [ids.usuario, 'SUPER_ADMIN']);
  });

  after(async () => {
    for (const resource of ['ocorrencias', 'moradores', 'unidades', 'condominios']) {
      if (ids[resource]) await app.inject({ method: 'DELETE', url: `/${resource}/${ids[resource]}`, headers: headers() });
    }
    await pool?.query('DELETE FROM usuario_perfis WHERE usuario_id = ?', [ids.usuario]);
    await pool?.query('DELETE FROM usuarios WHERE id = ?', [ids.usuario]);
    await pool?.query('DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = ?)', [email]);
    await pool?.query('DELETE FROM account WHERE userId IN (SELECT id FROM user WHERE email = ?)', [email]);
    await pool?.query('DELETE FROM user WHERE email = ?', [email]);
    await app.close();
  });

  it('persiste sessão, protege rotas e encerra sessão', async () => {
    const session = await app.inject({ method: 'GET', url: '/api/auth/get-session', headers: headers() });
    assert.equal(session.statusCode, 200);
    const me = await app.inject({ method: 'GET', url: '/me', headers: headers() });
    assert.equal(me.statusCode, 200, me.body);
    assert.equal(me.json().email, email);
    assert.ok(me.json().memberships.some((membership: { perfil: string }) => membership.perfil === 'SUPER_ADMIN'));
    const [stored] = await pool!.query('SELECT id FROM session WHERE token = ?', [session.json().session.token]);
    assert.equal((stored as unknown[]).length, 1);
    assert.equal((await app.inject({ method: 'GET', url: '/usuarios' })).statusCode, 401);
    assert.equal((await app.inject({ method: 'POST', url: '/api/auth/sign-out', headers: headers() })).statusCode, 200);
    assert.equal((await app.inject({ method: 'GET', url: '/usuarios', headers: headers() })).statusCode, 401);
    const signin = await app.inject({ method: 'POST', url: '/api/auth/sign-in/email', headers: { origin }, payload: { email, password } });
    assert.equal(signin.statusCode, 200, signin.body);
    cookie = readCookie(signin);
  });

  it('aplica escopo do condomínio e retorna 403 para papel sem permissão', async () => {
    const create = async (url: string, payload: unknown) => {
      const response = await app.inject({ method: 'POST', url, headers: headers(), payload });
      assert.equal(response.statusCode, 201, response.body);
      return response.json() as { id: number };
    };
    ids.condominios = (await create('/condominios', { nome: `Condomínio ${suffix}` })).id;
    const otherCondo = (await create('/condominios', { nome: `Outro ${suffix}` })).id;
    ids.otherCondo = otherCondo;
    ids.unidades = (await create('/unidades', { condominio_id: ids.condominios, bloco: 'A', numero: '1' })).id;
    const otherUnit = (await create('/unidades', { condominio_id: otherCondo, bloco: 'B', numero: '1' })).id;
    const block = (await create('/blocos', { condominio_id: ids.condominios, nome: 'Bloco A' })).id;
    const otherBlock = (await create('/blocos', { condominio_id: otherCondo, nome: 'Bloco B' })).id;
    const administrator = (await create('/administradoras', { nome: `Administradora ${suffix}` })).id;

    const residentEmail = `resident.${suffix}@example.com`;
    const signup = await app.inject({ method: 'POST', url: '/api/auth/sign-up/email', headers: { origin }, payload: { name: 'Morador', email: residentEmail, password } });
    const residentCookie = readCookie(signup);
    const [residentRows] = await pool!.query<{ id: number }[]>('SELECT id FROM usuarios WHERE email = ?', [residentEmail]);
    await pool!.query('INSERT INTO usuario_perfis (usuario_id, condominio_id, perfil) VALUES (?, ?, ?)', [residentRows[0].id, ids.condominios, 'MORADOR']);
    const residentHeaders = { origin, cookie: residentCookie };
    const visible = await app.inject({ method: 'GET', url: '/condominios', headers: residentHeaders });
    assert.equal(visible.statusCode, 200, visible.body);
    assert.deepEqual(visible.json().map((row: { id: number }) => row.id), [ids.condominios]);
    assert.equal((await app.inject({ method: 'GET', url: `/unidades/${otherUnit}`, headers: residentHeaders })).statusCode, 403);
    const visibleBlocks = await app.inject({ method: 'GET', url: '/blocos', headers: residentHeaders });
    assert.equal(visibleBlocks.statusCode, 200, visibleBlocks.body);
    assert.deepEqual(visibleBlocks.json().map((row: { id: number }) => row.id), [block]);
    assert.equal((await app.inject({ method: 'POST', url: '/gestores', headers: residentHeaders, payload: { condominio_id: ids.condominios, pessoa_id: ids.usuario, tipo_gestor: 'sindico' } })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url: '/condominios', headers: residentHeaders, payload: { nome: 'Negado' } })).statusCode, 403);
    await app.inject({ method: 'DELETE', url: `/blocos/${block}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/blocos/${otherBlock}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/administradoras/${administrator}`, headers: headers() });
    await pool!.query('DELETE FROM usuario_perfis WHERE usuario_id = ?', [residentRows[0].id]);
    await pool!.query('DELETE FROM usuarios WHERE id = ?', [residentRows[0].id]);
    await pool!.query('DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = ?)', [residentEmail]);
    await pool!.query('DELETE FROM account WHERE userId IN (SELECT id FROM user WHERE email = ?)', [residentEmail]);
    await pool!.query('DELETE FROM user WHERE email = ?', [residentEmail]);
  });

  it('expÃµe os lotes 3 e 4 e mantÃ©m isolamento nos novos domÃ­nios', async () => {
    const resources = [
      'visitantes', 'autorizacoes-visita', 'visitas', 'funcionarios-portaria', 'turnos-portaria', 'postos-portaria',
      'encomendas', 'transportadoras', 'retiradas-encomendas', 'prestadores', 'empresas-prestadoras', 'acessos-prestadores',
      'credenciais-acesso', 'registros-acesso', 'dispositivos-acesso', 'chaves', 'retiradas-chaves', 'historico-chaves',
      'ocorrencias-seguranca', 'envolvidos-ocorrencias', 'evidencias-ocorrencias', 'cameras', 'incidentes', 'registros-monitoramento',
      'comunicados', 'destinatarios-comunicados', 'leituras-comunicados', 'notificacoes', 'preferencias-notificacao', 'historico-notificacoes'
    ];
    for (const resource of resources) {
      const response = await app.inject({ method: 'GET', url: `/${resource}`, headers: headers() });
      assert.equal(response.statusCode, 200, `${resource}: ${response.body}`);
    }

    const visitor = await app.inject({ method: 'POST', url: '/visitantes', headers: headers(), payload: { condominio_id: ids.condominios, nome: `Visitante ${suffix}` } });
    assert.equal(visitor.statusCode, 201, visitor.body);
    const visitorId = visitor.json().id as number;
    const visitorUpdate = await app.inject({ method: 'PUT', url: `/visitantes/${visitorId}`, headers: headers(), payload: { nome: `Visitante atualizado ${suffix}` } });
    assert.equal(visitorUpdate.statusCode, 200, visitorUpdate.body);
    const [storedVisitor] = await pool!.query<{ nome: string }[]>('SELECT nome FROM visitantes WHERE id = ?', [visitorId]);
    assert.equal(storedVisitor[0].nome, `Visitante atualizado ${suffix}`);
    const otherVisitor = await app.inject({ method: 'POST', url: '/visitantes', headers: headers(), payload: { condominio_id: ids.otherCondo, nome: `Outro visitante ${suffix}` } });
    assert.equal(otherVisitor.statusCode, 201, otherVisitor.body);

    const residentEmail = `resident.modules.${suffix}@example.com`;
    const signup = await app.inject({ method: 'POST', url: '/api/auth/sign-up/email', headers: { origin }, payload: { name: 'Morador módulos', email: residentEmail, password } });
    const residentCookie = readCookie(signup);
    const [residentRows] = await pool!.query<{ id: number }[]>('SELECT id FROM usuarios WHERE email = ?', [residentEmail]);
    await pool!.query('INSERT INTO usuario_perfis (usuario_id, condominio_id, perfil) VALUES (?, ?, ?)', [residentRows[0].id, ids.condominios, 'MORADOR']);
    const residentHeaders = { origin, cookie: residentCookie };
    const visible = await app.inject({ method: 'GET', url: '/visitantes', headers: residentHeaders });
    assert.equal(visible.statusCode, 200, visible.body);
    assert.ok(visible.json().some((row: { id: number }) => row.id === visitorId));
    assert.equal((await app.inject({ method: 'GET', url: `/visitantes/${otherVisitor.json().id}`, headers: residentHeaders })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url: '/dispositivos-acesso', headers: residentHeaders, payload: { condominio_id: ids.condominios, nome: 'Negado' } })).statusCode, 403);

    const batch56Resources = [
      'solicitacoes', 'categorias-solicitacao', 'historico-solicitacoes', 'manifestacoes', 'respostas-manifestacoes', 'anexos-manifestacoes',
      'assembleias', 'participantes-assembleia', 'pautas-assembleia', 'votacoes', 'opcoes-votacao', 'votos', 'documentos', 'categorias-documento', 'permissoes-documento',
      'taxas-condominiais', 'composicoes-taxa', 'lancamentos-unidades', 'contas-pagar', 'parcelas-pagar', 'pagamentos-fornecedores', 'contas-receber', 'parcelas-receber', 'recebimentos', 'debitos-condominiais', 'acordos-divida', 'historico-cobrancas',
      'contas-bancarias', 'movimentacoes-financeiras', 'transferencias', 'orcamentos', 'itens-orcamento', 'revisoes-orcamento', 'fundos', 'movimentacoes-fundos', 'destinacoes-fundos', 'extratos-bancarios', 'itens-extrato', 'conciliacoes', 'plano-contas', 'lancamentos-contabeis', 'periodos-contabeis',
      'planos-manutencao', 'tarefas-preventivas', 'agendamentos-manutencao', 'ordens-servico', 'problemas-reportados', 'historico-ordens-servico', 'ativos', 'categorias-ativos', 'historico-ativos', 'produtos-estoque', 'movimentacoes-estoque', 'inventarios', 'fornecedores', 'contratos-fornecedores', 'aditivos-contratuais', 'areas-limpeza', 'rotinas-limpeza', 'execucoes-limpeza', 'medidores', 'leituras-medidores', 'consumos-mensais', 'areas-comuns', 'reservas', 'regras-reserva', 'equipamentos-lazer', 'inscricoes-atividades', 'registros-utilizacao'
    ];
    for (const resource of batch56Resources) {
      const response = await app.inject({ method: 'GET', url: `/${resource}`, headers: headers() });
      assert.equal(response.statusCode, 200, `${resource}: ${response.body}`);
    }
    const request = await app.inject({ method: 'POST', url: '/solicitacoes', headers: headers(), payload: { condominio_id: ids.condominios, titulo: `Solicitação ${suffix}`, descricao: 'Teste' } });
    assert.equal(request.statusCode, 201, request.body);
    const otherRequest = await app.inject({ method: 'POST', url: '/solicitacoes', headers: headers(), payload: { condominio_id: ids.otherCondo, titulo: `Solicitação externa ${suffix}` } });
    assert.equal(otherRequest.statusCode, 201, otherRequest.body);
    const [storedRequest] = await pool!.query<{ titulo: string }[]>('SELECT titulo FROM solicitacoes WHERE id = ?', [request.json().id]);
    assert.equal(storedRequest[0].titulo, `Solicitação ${suffix}`);
    const changedRelation = await app.inject({ method: 'POST', url: '/solicitacoes-mudanca', headers: headers(), payload: { condominio_id: ids.otherCondo, unidade_id: ids.unidades, status: 'PENDENTE' } });
    assert.equal(changedRelation.statusCode, 422, changedRelation.body);
    assert.equal((await app.inject({ method: 'GET', url: `/solicitacoes/${otherRequest.json().id}`, headers: residentHeaders })).statusCode, 403);

    const batch78Resources = [
      'solicitacoes-mudanca', 'autorizacoes-obra', 'vistorias-unidades', 'animais-estimacao', 'tipos-animais', 'registros-animais',
      'logs-auditoria', 'historico-alteracoes', 'sessoes-usuario', 'consentimentos', 'solicitacoes-privacidade', 'politicas-retencao',
      'relatorios-salvos', 'execucoes-relatorios', 'indicadores-condominio', 'integracoes', 'credenciais-integracao', 'logs-integracao',
      'regras-automacao', 'tarefas-agendadas', 'execucoes-automacao'
    ];
    for (const resource of batch78Resources) {
      const response = await app.inject({ method: 'GET', url: `/${resource}`, headers: headers() });
      assert.equal(response.statusCode, 200, `${resource}: ${response.body}`);
    }
    const change = await app.inject({ method: 'POST', url: '/solicitacoes-mudanca', headers: headers(), payload: { condominio_id: ids.condominios, unidade_id: ids.unidades, data_prevista: '2030-01-01 10:00:00', status: 'PENDENTE' } });
    assert.equal(change.statusCode, 201, change.body);
    const otherChange = await app.inject({ method: 'POST', url: '/solicitacoes-mudanca', headers: headers(), payload: { condominio_id: ids.otherCondo, status: 'PENDENTE' } });
    assert.equal(otherChange.statusCode, 201, otherChange.body);
    assert.equal((await app.inject({ method: 'GET', url: `/solicitacoes-mudanca/${otherChange.json().id}`, headers: residentHeaders })).statusCode, 403);

    const privacy = await app.inject({ method: 'POST', url: '/solicitacoes-privacidade', headers: residentHeaders, payload: { condominio_id: ids.condominios, tipo_solicitacao: 'ACESSO', descricao: 'Solicito meus dados' } });
    assert.equal(privacy.statusCode, 201, privacy.body);

    assert.equal((await app.inject({ method: 'GET', url: '/uploads/documentos/999999' })).statusCode, 401);
    const document = await app.inject({ method: 'POST', url: '/documentos', headers: headers(), payload: { condominio_id: ids.condominios, titulo: `Documento ${suffix}` } });
    assert.equal(document.statusCode, 201, document.body);
    const documentId = document.json().id as number;
    const uploadPayload = multipart('contrato.pdf', 'application/pdf', Buffer.from('%PDF-1.4 upload-test'));
    const uploaded = await app.inject({
      method: 'POST',
      url: `/uploads/documentos/${documentId}`,
      headers: { ...headers(), 'content-type': uploadPayload.contentType },
      payload: uploadPayload.body
    });
    assert.equal(uploaded.statusCode, 200, uploaded.body);
    assert.match(uploaded.json().arquivoUrl, /^\/uploads\/[0-9]+\/documentos\//);
    const [storedDocument] = await pool!.query<{ arquivo_url: string }[]>('SELECT arquivo_url FROM documentos WHERE id = ?', [documentId]);
    assert.equal(storedDocument[0].arquivo_url, uploaded.json().arquivoUrl);
    const retrieved = await app.inject({ method: 'GET', url: `/uploads/documentos/${documentId}`, headers: residentHeaders });
    assert.equal(retrieved.statusCode, 200, retrieved.body);
    assert.equal(retrieved.headers['content-type'], 'application/pdf');
    assert.match(retrieved.body, /%PDF-1\.4 upload-test/);
    const deniedPayload = multipart('negado.pdf', 'application/pdf', Buffer.from('%PDF-1.4 denied'));
    assert.equal((await app.inject({
      method: 'POST',
      url: `/uploads/documentos/${documentId}`,
      headers: { ...residentHeaders, 'content-type': deniedPayload.contentType },
      payload: deniedPayload.body
    })).statusCode, 403);
    const invalidPayload = multipart('arquivo.pdf', 'image/png', Buffer.from('not-an-image'));
    assert.equal((await app.inject({
      method: 'POST',
      url: `/uploads/documentos/${documentId}`,
      headers: { ...headers(), 'content-type': invalidPayload.contentType },
      payload: invalidPayload.body
    })).statusCode, 415);
    assert.equal((await app.inject({ method: 'POST', url: '/condominios', headers: headers(), payload: { nome: '' } })).statusCode, 400);
    assert.equal((await app.inject({ method: 'GET', url: '/condominios/not-an-id', headers: headers() })).statusCode, 400);
    assert.equal((await app.inject({ method: 'POST', url: `/uploads/documentos/${documentId}`, headers: headers() })).statusCode, 400);
    const oversizedPayload = multipart('grande.pdf', 'application/pdf', Buffer.alloc(10 * 1024 * 1024 + 1, 65));
    assert.equal((await app.inject({ method: 'POST', url: `/uploads/documentos/${documentId}`, headers: { ...headers(), 'content-type': oversizedPayload.contentType }, payload: oversizedPayload.body })).statusCode, 413);
    await rm(path.resolve(env.uploadDir, uploaded.json().arquivoUrl.slice('/uploads/'.length)), { force: true });
    await app.inject({ method: 'DELETE', url: `/documentos/${documentId}`, headers: headers() });
    assert.equal((await app.inject({ method: 'POST', url: '/integracoes', headers: residentHeaders, payload: { condominio_id: ids.condominios, nome: 'Negada', provedor: 'teste' } })).statusCode, 403);
    const audit = await app.inject({ method: 'POST', url: '/logs-auditoria', headers: headers(), payload: { condominio_id: ids.condominios, acao: 'TESTE', entidade: 'solicitacoes' } });
    assert.equal(audit.statusCode, 201, audit.body);
    assert.equal((await app.inject({ method: 'PUT', url: `/logs-auditoria/${audit.json().id}`, headers: headers(), payload: { acao: 'ALTERADA' } })).statusCode, 403);

    await app.inject({ method: 'DELETE', url: `/visitantes/${visitorId}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/visitantes/${otherVisitor.json().id}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/solicitacoes/${request.json().id}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/solicitacoes/${otherRequest.json().id}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/solicitacoes-mudanca/${change.json().id}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/solicitacoes-mudanca/${otherChange.json().id}`, headers: headers() });
    await app.inject({ method: 'DELETE', url: `/solicitacoes-privacidade/${privacy.json().id}`, headers: headers() });
    await pool!.query('DELETE FROM logs_auditoria WHERE id = ?', [audit.json().id]);
    await pool!.query('DELETE FROM usuario_perfis WHERE usuario_id = ?', [residentRows[0].id]);
    await pool!.query('DELETE FROM usuarios WHERE id = ?', [residentRows[0].id]);
    await pool!.query('DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = ?)', [residentEmail]);
    await pool!.query('DELETE FROM account WHERE userId IN (SELECT id FROM user WHERE email = ?)', [residentEmail]);
    await pool!.query('DELETE FROM user WHERE email = ?', [residentEmail]);
  });
});
