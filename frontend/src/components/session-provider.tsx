'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, apiMessage, setAuthChangedHandler, setUnauthorizedHandler } from '../lib/api';
import type { Me, PermissionAction, Permissions, Session } from '../lib/types';
type Value = { session: Session | null; me: Me | null; permissions: Permissions | null; canAccess: (resource: string, action?: PermissionAction) => boolean; loading: boolean; error: string; refresh: () => Promise<void>; signOut: () => Promise<void> };
const Context = createContext<Value | null>(null);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null); const [me, setMe] = useState<Me | null>(null); const [permissions, setPermissions] = useState<Permissions | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const router = useRouter();
  const refresh = async () => { setLoading(true); try { const current = await api.get<Session | null>('/api/auth/get-session'); setSession(current.data); if (current.data) { const [meResult, permissionsResult] = await Promise.all([api.get<Me>('/me'), api.get<Permissions>('/me/permissoes')]); setMe(meResult.data); setPermissions(permissionsResult.data); } else { setMe(null); setPermissions(null); } } catch (cause) { setSession(null); setMe(null); setPermissions(null); setError(apiMessage(cause, 'Não foi possível carregar sua sessão.')); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, []);
  useEffect(() => { setUnauthorizedHandler(() => { setSession(null); setMe(null); setPermissions(null); router.replace('/login'); }); return () => setUnauthorizedHandler(undefined); }, [router]);
  useEffect(() => { setAuthChangedHandler(() => { void refresh(); }); return () => setAuthChangedHandler(undefined); }, []);
  const signOut = async () => { try { await api.post('/api/auth/sign-out'); } finally { setSession(null); setMe(null); setPermissions(null); router.replace('/login'); } };
  // Permissões vêm do banco (perfis/permissoes/perfil_permissoes) via /me/permissoes.
  const canAccess = (resource: string, action: PermissionAction = 'read') => Boolean(permissions?.superAdmin || permissions?.permissions[resource]?.includes(action));
  const value = useMemo(() => ({ session, me, permissions, canAccess, loading, error, refresh, signOut }), [session, me, permissions, loading, error]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSession() { const value = useContext(Context); if (!value) throw new Error('useSession deve ser usado dentro de SessionProvider'); return value; }
