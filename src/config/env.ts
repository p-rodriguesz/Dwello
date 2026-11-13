import 'dotenv/config';

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
}

export const env = {
  port,
  host: '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3001',
  uploadDir: process.env.UPLOAD_DIR ?? 'storage/uploads'
} as const;
