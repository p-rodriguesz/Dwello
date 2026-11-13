import { eq, like, or } from 'drizzle-orm';
import { requireDb } from '../db/index.js';
import { usuarios } from '../db/schema.js';

export type UsuarioInput = {
  nome: string;
  email: string;
  authUserId?: string;
  senhaHash?: string | null;
  perfil: typeof usuarios.$inferInsert.perfil;
  ativo: boolean;
};

export type UsuarioUpdate = Partial<Omit<UsuarioInput, 'senhaHash' | 'authUserId'>> & {
  senhaHash?: string | null;
  authUserId?: string | null;
};

export async function listarUsuarios(query?: string) {
  const db = requireDb();
  const termo = query?.trim();
  return db.select().from(usuarios).where(
    termo
      ? or(like(usuarios.nome, `%${termo}%`), like(usuarios.email, `%${termo}%`))
      : undefined
  );
}

export async function buscarUsuarioPorId(id: number) {
  const db = requireDb();
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  return usuario;
}

export async function criarUsuario(input: UsuarioInput) {
  const db = requireDb();
  const result = await db.insert(usuarios).values(input);
  return buscarUsuarioPorId(Number(result[0].insertId));
}

export async function atualizarUsuario(id: number, values: UsuarioUpdate) {
  const db = requireDb();
  const result = await db.update(usuarios).set(values).where(eq(usuarios.id, id));
  if (!result[0].affectedRows) return undefined;
  return buscarUsuarioPorId(id);
}

export async function excluirUsuario(id: number) {
  const db = requireDb();
  const result = await db.delete(usuarios).where(eq(usuarios.id, id));
  return result[0].affectedRows > 0;
}
