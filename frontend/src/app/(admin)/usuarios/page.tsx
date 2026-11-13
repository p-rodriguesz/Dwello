'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../../../components/session-provider';
import { api, apiMessage } from '../../../lib/api';
import { rolesOf } from '../../../lib/permissions';
import type { Role } from '../../../lib/types';

type UsuarioPapel = { id: number; nome: string | null; email: string | null; ativo: boolean; papel: Role | null };

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super admin',
  ADMINISTRADORA: 'Administradora',
  SINDICO: 'Síndico',
  SUBSINDICO: 'Subsíndico',
  CONSELHEIRO: 'Conselheiro',
  PORTEIRO: 'Porteiro',
  ZELADOR: 'Zelador',
  FUNCIONARIO: 'Funcionário',
  PROPRIETARIO: 'Proprietário',
  MORADOR: 'Morador',
  VISITANTE: 'Visitante',
  PRESTADOR: 'Prestador'
};

export default function UsuariosPage() {
  const { me } = useSession();
  const isSuperAdmin = rolesOf(me).includes('SUPER_ADMIN');
  const [rows, setRows] = useState<UsuarioPapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { setRows((await api.get<UsuarioPapel[]>('/usuarios/papeis')).data); }
    catch (cause) { setError(apiMessage(cause)); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (isSuperAdmin) void load(); else setLoading(false); }, [isSuperAdmin]);

  const change = async (row: UsuarioPapel, perfil: Role) => {
    setSavingId(row.id); setError(''); setNotice('');
    try {
      await api.put(`/usuarios/${row.id}/papel`, { perfil });
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, papel: perfil } : item));
      setNotice(`${row.nome ?? row.email} agora é ${ROLE_LABELS[perfil]}. A pessoa precisa recarregar a página para ver o novo menu.`);
    } catch (cause) { setError(apiMessage(cause, 'Não foi possível alterar o papel.')); }
    finally { setSavingId(null); }
  };

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? rows.filter((r) => `${r.nome ?? ''} ${r.email ?? ''} ${r.papel ?? ''}`.toLowerCase().includes(q)) : rows;
  }, [rows, filter]);

  if (!isSuperAdmin) {
    return <div className="resource-page"><div className="form-error">Apenas o SUPER_ADMIN pode gerenciar usuários.</div></div>;
  }

  return <div className="resource-page">
    <div className="page-heading"><div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Usuários e cargos</h1><p>Defina o cargo de cada pessoa: morador, zelador, porteiro, síndico e outros.</p></div></div>
    {error && <div className="form-error">{error}</div>}
    {notice && <div className="form-notice">{notice}</div>}
    <div className="list-toolbar">
      <label className="search-field"><span>⌕</span><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar por nome, e-mail ou papel..." /></label>
      <button type="button" className="outline-button" onClick={() => void load()} disabled={loading}>↻ Atualizar</button>
    </div>
    <div className="panel table-panel">
      {loading ? <div className="empty-state"><span className="spinner" /> Carregando usuários...</div>
        : visible.length === 0 ? <div className="empty-state"><span>⌁</span><strong>Nenhum usuário encontrado</strong></div>
        : <div className="table-scroll"><table>
          <thead><tr><th>Nome</th><th>E-mail</th><th>Papel</th></tr></thead>
          <tbody>{visible.map((row) => <tr key={row.id}>
            <td>{row.nome ?? '—'}</td>
            <td>{row.email ?? '—'}</td>
            <td>{row.id === me?.id
              ? <span className="status-pill success">{row.papel ? ROLE_LABELS[row.papel] ?? row.papel : '—'} (você)</span>
              : <select className="status-select" value={row.papel ?? ''} disabled={savingId === row.id} onChange={(e) => void change(row, e.target.value as Role)}>
                  {!row.papel && <option value="" disabled>Sem papel</option>}
                  {(Object.keys(ROLE_LABELS) as Role[]).map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
                </select>}
            </td>
          </tr>)}</tbody>
        </table></div>}
    </div>
  </div>;
}
