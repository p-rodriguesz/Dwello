"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const usuariosRoutes = async (fastify) => {
    fastify.get('/usuarios', usuarios_controller_1.listarUsuarios);
    fastify.get('/usuarios/:id', usuarios_controller_1.buscarUsuarioPorId);
    fastify.post('/usuarios', usuarios_controller_1.criarUsuario);
    fastify.put('/usuarios/:id', usuarios_controller_1.atualizarUsuario);
    fastify.delete('/usuarios/:id', usuarios_controller_1.excluirUsuario);
};
exports.default = usuariosRoutes;
