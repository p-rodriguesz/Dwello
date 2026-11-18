'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '../../../../components/session-provider';
import { api, apiMessage } from '../../../../lib/api';
import { resourceEndpoint, resourceLabel } from '../../../../lib/resources';

type Field = { key: string; type: 'text' | 'id' | 'number' | 'boolean' | 'date'; required: boolean };
type Row = Record<string, unknown>;
const PAGE_SIZE = 10;
const HIDDEN_COLUMNS = new Set(['createdAt', 'updatedAt']);
const camel = (key: string) => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleString('pt-BR');
  return String(value);
}

function toInput(field: Field, value: unknown) {
  if (value === null || value === undefined) return field.type === 'boolean' ? false : '';
  if (field.type === 'date' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) return String(value).slice(0, 16);
  return field.type === 'boolean' ? Boolean(value) : String(value);
}

export default function ModuloPage() {
  const { recurso } = useParams<{ recurso: string }>();
  const { canAccess, loading: sessionLoading } = useSession();
  const endpoint = resourceEndpoint(recurso);
  const title = resourceLabel(recurso);
  const can = { read: canAccess(recurso, 'read'), create: canAccess(recurso, 'create'), update: canAccess(recurso, 'update'), delete: canAccess(recurso, 'delete') };

  const [fields, setFields] = useState<Field[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [meta, list] = await Promise.all([
        api.get<{ fields: Field[] }>(`/meta/recursos/${recurso}`),
        api.get<Row[]>(endpoint, { params: { q: filter || undefined, page, pageSize: PAGE_SIZE } })
      ]);
      setFields(meta.data.fields); setRows(list.data);
      setTotal(Number(list.headers?.['x-total-count'] ?? list.data.length));
    } catch (cause) { setError(apiMessage(cause)); }
    finally { setLoading(false); }
  };
  useEffect(() => { setPage(1); setEditing(null); setFilter(''); if (!sessionLoading && can.read) void load(); else if (!sessionLoading) setLoading(false); }, [recurso, sessionLoading, can.read]);
  useEffect(() => { if (!sessionLoading && can.read) void load(); }, [page, filter]);

  const columns = useMemo(() => {
    const keys = rows.length ? Object.keys(rows[0]) : ['id', ...fields.map((field) => camel(field.key))];
    return keys.filter((key) => !HIDDEN_COLUMNS.has(key)).slice(0, 7);
  }, [rows, fields]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visible = rows;

  const startCreate = () => { setForm(Object.fromEntries(fields.map((field) => [field.key, field.type === 'boolean' ? false : '']))); setEditing('new'); };
  const startEdit = (row: Row) => { setForm(Object.fromEntries(fields.map((field) => [field.key, toInput(field, row[camel(field.key)] ?? row[field.key])]))); setEditing(Number(row.id)); };

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const value = form[field.key];
      if (field.type === 'boolean') { body[field.key] = Boolean(value); continue; }
      // Campo vazio: ao editar, só texto pode ser limpo (a API recusa null em IDs, números e datas).
      if (value === '' || value === undefined) { if (editing !== 'new' && field.type === 'text') body[field.key] = null; continue; }
      body[field.key] = field.type === 'id' || field.type === 'number' ? Number(value) : value;
    }
    try {
      if (editing === 'new') await api.post(endpoint, body); else await api.put(`${endpoint}/${editing}`, body);
      setEditing(null); await load();
    } catch (cause) { setError(apiMessage(cause)); }
    finally { setSaving(false); }
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Excluir o registro #${row.id}?`)) return;
    setError('');
    try { await api.delete(`${endpoint}/${row.id}`); await load(); } catch (cause) { setError(apiMessage(cause)); }
  };

  if (!sessionLoading && !can.read) {
    return <div className="resource-page"><div className="form-error">Seu cargo não tem acesso a {title.toLowerCase()}.</div></div>;
  }

  return <div className="resource-page">
    <div className="page-heading">
      <div><span className="eyebrow">MÓDULO</span><h1>{title}</h1><p>Permissões do seu cargo: {(['read', 'create', 'update', 'delete'] as const).filter((a) => can[a]).map((a) => ({ read: 'ver', create: 'criar', update: 'editar', delete: 'excluir' })[a]).join(', ')}.</p></div>
      {can.create && <button className="primary-button compact" onClick={() => editing === 'new' ? setEditing(null) : startCreate()}>+ Novo registro</button>}
    </div>
    {error && <div className="form-error">{error}</div>}
    {editing !== null && <form className="inline-form module-form" onSubmit={submit}>
      <strong className="module-form-title">{editing === 'new' ? 'Novo registro' : `Editando #${editing}`}</strong>
      {fields.map((field) => <label key={field.key}>{resourceLabel(field.key.replace(/_id$/, ''))}{field.type === 'id' ? ' (ID)' : ''}{field.required ? ' *' : ''}
        {field.type === 'boolean'
          ? <input type="checkbox" checked={Boolean(form[field.key])} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} />
          : <input type={field.type === 'date' ? 'datetime-local' : field.type === 'id' || field.type === 'number' ? 'number' : 'text'} value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required && editing === 'new'} />}
      </label>)}
      <div className="module-form-actions"><button type="button" className="outline-button" onClick={() => setEditing(null)}>Cancelar</button><button className="primary-button compact" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button></div>
    </form>}
    <div className="list-toolbar">
      <label className="search-field"><span>⌕</span><input value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} placeholder={`Filtrar ${title.toLowerCase()}...`} /></label>
      <button type="button" className="outline-button" onClick={() => void load()} disabled={loading}>↻ Atualizar</button>
    </div>
    <div className="panel table-panel">
      {loading ? <div className="empty-state"><span className="spinner" /> Carregando dados...</div>
        : visible.length === 0 ? <div className="empty-state"><span>⌁</span><strong>{filter ? 'Nenhum resultado encontrado' : 'Nenhum registro encontrado'}</strong></div>
        : <div className="table-scroll"><table>
          <thead><tr>{columns.map((column) => <th key={column}>{resourceLabel(column.replace(/([A-Z])/g, '_$1').toLowerCase())}</th>)}{(can.update || can.delete) && <th>Ações</th>}</tr></thead>
          <tbody>{visible.map((row, index) => <tr key={String(row.id ?? index)}>
            {columns.map((column) => <td key={column}>{formatValue(row[column])}</td>)}
            {(can.update || can.delete) && <td className="row-actions">
              {can.update && <button type="button" className="link-button" onClick={() => startEdit(row)}>Editar</button>}
              {can.delete && <button type="button" className="link-button danger" onClick={() => void remove(row)}>Excluir</button>}
            </td>}
          </tr>)}</tbody>
        </table></div>}
      {!loading && total > 0 && <div className="pagination"><span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} de {total}</span><div><button type="button" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page === 1}>‹</button><strong>{page} / {totalPages}</strong><button type="button" onClick={() => setPage((v) => Math.min(totalPages, v + 1))} disabled={page === totalPages}>›</button></div></div>}
    </div>
  </div>;
}
