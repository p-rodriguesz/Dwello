import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { app } from '../src/app';

describe('API integrada ao banco dwello', () => {
  const suffix = Date.now();
  const ids: Record<string, number> = {};

  before(async () => { await app.ready(); });
  after(async () => {
    for (const resource of ['ocorrencias', 'moradores', 'unidades', 'usuarios', 'condominios']) {
      if (ids[resource]) await app.inject({ method: 'DELETE', url: `/${resource}/${ids[resource]}` });
    }
    await app.close();
  });

  it('cria os recursos relacionados e pesquisa usuários no MySQL', async () => {
    const criar = async (url: string, payload: unknown) => {
      const response = await app.inject({ method: 'POST', url, payload });
      assert.equal(response.statusCode, 201, response.body);
      return response.json() as { id: number };
    };
    ids.condominios = (await criar('/condominios', { nome: `Condomínio ${suffix}` })).id;
    ids.usuarios = (await criar('/usuarios', { nome: 'Ana Teste', email: `ana.${suffix}@example.com`, senha: 'senha123' })).id;
    ids.unidades = (await criar('/unidades', { condominio_id: ids.condominios, bloco: 'A', numero: String(suffix) })).id;
    ids.moradores = (await criar('/moradores', { usuario_id: ids.usuarios, unidade_id: ids.unidades })).id;
    ids.ocorrencias = (await criar('/ocorrencias', { usuario_id: ids.usuarios, unidade_id: ids.unidades, titulo: 'Teste', descricao: 'Ocorrência de teste' })).id;

    const response = await app.inject({ method: 'GET', url: `/usuarios?q=ana.${suffix}` });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().length, 1);
    assert.equal(response.json()[0].senhaHash, undefined);
  });

  it('atualiza e busca uma ocorrência', async () => {
    const update = await app.inject({ method: 'PUT', url: `/ocorrencias/${ids.ocorrencias}`, payload: { status: 'em_andamento' } });
    assert.equal(update.statusCode, 200, update.body);
    assert.equal(update.json().status, 'em_andamento');
    const get = await app.inject({ method: 'GET', url: `/ocorrencias/${ids.ocorrencias}` });
    assert.equal(get.statusCode, 200);
  });
});
