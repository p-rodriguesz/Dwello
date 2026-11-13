'use client';
import { useEffect } from 'react'; import { useRouter } from 'next/navigation'; import { useSession } from './session-provider';
export function ProtectedPage({ children }: { children: React.ReactNode }) { const { session, loading } = useSession(); const router = useRouter(); useEffect(() => { if (!loading && !session) router.replace('/login'); }, [loading, session, router]); if (loading || !session) return <div className="page-loading"><span className="spinner" /> Carregando seu condomínio...</div>; return <>{children}</>; }
