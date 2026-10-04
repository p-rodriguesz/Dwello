import Fastify from 'fastify';
import { pool } from './db';
import statusRoutes from './routes/status.routes';
import usuariosRoutes from './routes/usuarios.routes';
import recursosRoutes from './routes/recursos.routes';

export const app = Fastify({
  logger: true
});

app.register(usuariosRoutes);
app.register(recursosRoutes);
app.register(statusRoutes);

app.addHook('onClose', async () => {
  await pool?.end();
});

