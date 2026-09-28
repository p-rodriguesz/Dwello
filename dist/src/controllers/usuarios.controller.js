"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarUsuarios = listarUsuarios;
exports.buscarUsuarioPorId = buscarUsuarioPorId;
exports.criarUsuario = criarUsuario;
exports.atualizarUsuario = atualizarUsuario;
exports.excluirUsuario = excluirUsuario;
const usuarios = [];
let proximoId = 1;
function isValidText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
function isValidEmail(value) {
    return isValidText(value) && value.includes('@');
}
function isValidUsuarioPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    const usuario = payload;
    return (isValidText(usuario.nome) &&
        isValidEmail(usuario.email) &&
        isValidText(usuario.senha) &&
        isValidText(usuario.apartamento) &&
        isValidText(usuario.bloco));
}
function parseId(id) {
    const parsedId = Number(id);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}
async function listarUsuarios(_request, reply) {
    return reply.status(200).send(usuarios);
}
async function buscarUsuarioPorId(request, reply) {
    const id = parseId(request.params.id);
    if (id === null) {
        return reply.status(400).send({ error: 'ID inválido.' });
    }
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }
    return reply.status(200).send(usuario);
}
async function criarUsuario(request, reply) {
    if (!isValidUsuarioPayload(request.body)) {
        return reply.status(400).send({ error: 'Dados do usuário inválidos.' });
    }
    const emailJaExiste = usuarios.some((usuario) => usuario.email === request.body.email);
    if (emailJaExiste) {
        return reply.status(409).send({ error: 'E-mail já cadastrado.' });
    }
    const usuario = {
        id: proximoId,
        ...request.body
    };
    usuarios.push(usuario);
    proximoId += 1;
    return reply.status(201).send(usuario);
}
async function atualizarUsuario(request, reply) {
    const id = parseId(request.params.id);
    if (id === null) {
        return reply.status(400).send({ error: 'ID inválido.' });
    }
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }
    const dados = request.body;
    if (!dados || typeof dados !== 'object') {
        return reply.status(400).send({ error: 'Dados do usuário inválidos.' });
    }
    const campos = Object.keys(dados);
    const camposValidos = [
        'nome',
        'email',
        'senha',
        'apartamento',
        'bloco'
    ];
    if (campos.some((campo) => !camposValidos.includes(campo)) ||
        campos.some((campo) => campo === 'email'
            ? !isValidEmail(dados[campo])
            : !isValidText(dados[campo]))) {
        return reply.status(400).send({ error: 'Dados do usuário inválidos.' });
    }
    if (dados.email &&
        usuarios.some((item) => item.email === dados.email && item.id !== id)) {
        return reply.status(409).send({ error: 'E-mail já cadastrado.' });
    }
    Object.assign(usuario, dados);
    return reply.status(200).send(usuario);
}
async function excluirUsuario(request, reply) {
    const id = parseId(request.params.id);
    if (id === null) {
        return reply.status(400).send({ error: 'ID inválido.' });
    }
    const indice = usuarios.findIndex((item) => item.id === id);
    if (indice === -1) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }
    usuarios.splice(indice, 1);
    return reply.status(204).send();
}
