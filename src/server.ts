import { app } from './app.js';
import { env } from './config/env.js';

app.listen({ port: env.port, host: env.host }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
