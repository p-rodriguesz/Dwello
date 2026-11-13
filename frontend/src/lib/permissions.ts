import type { Me, Role } from './types';
// Os papéis de verdade vêm de usuario_perfis (memberships); usuarios.perfil só é usado se não houver nenhum.
export function rolesOf(me: Me | null): Role[] { if (!me) return []; const fromMemberships = me.memberships.map((item) => item.perfil); return [...new Set(fromMemberships.length ? fromMemberships : [me.perfil.toUpperCase()])] as Role[]; }
export function can(me: Me | null, allowed: readonly Role[]) { const roles = rolesOf(me); return roles.includes('SUPER_ADMIN') || roles.some((role) => allowed.includes(role)); }
