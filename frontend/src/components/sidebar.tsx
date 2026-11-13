'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Brand } from './brand';
import { useSession } from './session-provider';
import { RESOURCE_GROUPS, resourceHref, resourceLabel } from '../lib/resources';

// O menu é montado a partir das permissões do cargo (vindas do banco): só aparece o que o usuário pode ler.
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { canAccess, permissions } = useSession();

  const groups = useMemo(() => RESOURCE_GROUPS
    .map((group) => ({ ...group, resources: group.resources.filter((resource) => canAccess(resource, 'read')) }))
    .filter((group) => group.resources.length > 0), [canAccess]);

  const activeGroup = groups.find((group) => group.resources.some((resource) => pathname === resourceHref(resource)))?.id;
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  useEffect(() => { if (activeGroup) setOpenGroups((current) => new Set(current).add(activeGroup)); }, [activeGroup]);
  const toggle = (id: string) => setOpenGroups((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return <aside className="sidebar">
    <div className="sidebar-head"><Brand inverse /></div>
    <div className="menu-label">Menu principal</div>
    <nav className="sidebar-nav">
      <Link href="/dashboard" onClick={onNavigate} className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}><span className="nav-icon">⌂</span>Visão geral</Link>
      {permissions?.superAdmin && <Link href="/usuarios" onClick={onNavigate} className={`nav-link ${pathname === '/usuarios' ? 'active' : ''}`}><span className="nav-icon">♙</span>Usuários e cargos</Link>}
      {groups.map((group) => {
        const open = openGroups.has(group.id);
        return <div key={group.id} className="nav-group">
          <button type="button" className={`nav-link nav-group-toggle ${group.id === activeGroup ? 'has-active' : ''}`} onClick={() => toggle(group.id)} aria-expanded={open}>
            <span className="nav-icon">{group.icon}</span>{group.label}<span className="nav-count">{group.resources.length}</span><span className="nav-caret">{open ? '▾' : '▸'}</span>
          </button>
          {open && <div className="nav-sublist">{group.resources.map((resource) => {
            const href = resourceHref(resource);
            return <Link key={resource} href={href} onClick={onNavigate} className={`nav-sublink ${pathname === href ? 'active' : ''}`}>{resourceLabel(resource)}</Link>;
          })}</div>}
        </div>;
      })}
    </nav>
    <div className="sidebar-bottom"><div className="sidebar-version">Dwello v1.0 · Sistema conectado</div></div>
  </aside>;
}
