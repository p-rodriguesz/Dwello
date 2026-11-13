import type { Metadata } from 'next'; import './globals.css'; import { SessionProvider } from '../components/session-provider';
export const metadata: Metadata = { title: 'Dwello · Gestão condominial', description: 'Seu condomínio conectado.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><SessionProvider>{children}</SessionProvider></body></html>; }
