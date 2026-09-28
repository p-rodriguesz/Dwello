import Fastify from 'fastify';
import usuariosRoutes from './routes/usuarios.routes';
import ocorrenciasRoutes from './routes/ocorrencias.routes';

export const app = Fastify({
  logger: true
});

app.register(usuariosRoutes);
app.register(ocorrenciasRoutes);

