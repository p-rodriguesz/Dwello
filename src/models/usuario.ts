export const PERFIS_RBAC = [
  'SUPER_ADMIN',
  'ADMINISTRADORA',
  'SINDICO',
  'SUBSINDICO',
  'CONSELHEIRO',
  'PORTEIRO',
  'ZELADOR',
  'FUNCIONARIO',
  'PROPRIETARIO',
  'MORADOR',
  'VISITANTE',
  'PRESTADOR'
] as const;

export type PerfilRbac = typeof PERFIS_RBAC[number];

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilRbac;
  ativo: boolean;
  criadoEm?: Date | null;
  authUserId?: string | null;
}

export interface UsuarioPerfil {
  id: number;
  usuarioId: number;
  condominioId: number | null;
  perfil: PerfilRbac;
  ativo: boolean;
}