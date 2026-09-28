import { FastifyPluginAsync } from 'fastify';
import {
  atualizarUsuario,
  buscarUsuarioPorId,
  criarUsuario,
  excluirUsuario,
  listarUsuarios
} from '../controllers/usuarios.controller';

const usuariosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/usuarios', listarUsuarios);
  fastify.get('/usuarios/:id', buscarUsuarioPorId);
  fastify.post('/usuarios', criarUsuario);
  fastify.put('/usuarios/:id', atualizarUsuario);
  fastify.delete('/usuarios/:id', excluirUsuario);
};

export default usuariosRoutes;