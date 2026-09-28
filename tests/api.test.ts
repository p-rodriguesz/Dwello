import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { app } from '../src/app';

describe('API', () => {
  before(async () => {
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  it('GET /usuarios lista os usuários', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/usuarios'
    });

    assert.equal(response.statusCode, 200);
    assert.ok(Array.isArray(response.json()));
  });

  it('POST /usuarios cria um usuário', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/usuarios',
      payload: {
        nome: 'Maria Silva',
        email: 'maria.teste@example.com',
        senha: 'senha123',
        apartamento: '101',
        bloco: 'A'
      }
    });

    assert.equal(response.statusCode, 201);
    assert.equal(response.json().nome, 'Maria Silva');
    assert.equal(response.json().email, 'maria.teste@example.com');
  });

  it('GET /usuarios/:id busca o usuário criado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/usuarios/1'
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().id, 1);
  });

  it('POST /ocorrencias retorna 404 enquanto a rota não está implementada', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/ocorrencias',
      payload: {
        titulo: 'Teste'
      }
    });

    assert.equal(response.statusCode, 404);
  });

  it('GET /ocorrencias retorna 404 enquanto a rota não está implementada', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ocorrencias'
    });

    assert.equal(response.statusCode, 404);
  });

  it('GET /ocorrencias/:id retorna 404 enquanto a rota não está implementada', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ocorrencias/1'
    });

    assert.equal(response.statusCode, 404);
  });
});