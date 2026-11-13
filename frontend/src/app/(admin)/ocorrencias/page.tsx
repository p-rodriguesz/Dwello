'use client';
import { useState } from 'react';
import { ResourcePage } from '../../../components/resource-page';
import { useSession } from '../../../components/session-provider';
import { api, apiMessage } from '../../../lib/api';
import { rolesOf } from '../../../lib/permissions';

const STATUS_LABELS: Record<string, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  resolvida: 'Resolvida',
  cancelada: 'Cancelada'
};
// Super admin e zelador só alternam entre aberta e resolvida.
const EDITABLE_STATUS = ['aberta', 'resolvida'];

function StatusSelect({ id, value, onChanged }: { id: number; value: string; onChanged: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const change = async (status: string) => {
    setSaving(true);
    try {
      await api.put(`/ocorrencias/${id}`, { status });
      await onChanged();
    } catch (cause) {
      window.alert(apiMessage(cause, 'Não foi possível alterar o status.'));
    } finally {
      setSaving(false);
    }
  };
  return (
    <select className="status-select" value={value} disabled={saving} onChange={(event) => void change(event.target.value)}>
      {!EDITABLE_STATUS.includes(value) && <option value={value} disabled>{STATUS_LABELS[value] ?? value}</option>}
      {EDITABLE_STATUS.map((key) => <option key={key} value={key}>{STATUS_LABELS[key]}</option>)}
    </select>
  );
}

export default function OcorrenciasPage() {
  const { me } = useSession();
  // Quem pode alternar entre Aberta e Resolvida.
  const canChangeStatus = rolesOf(me).some((role) => role === 'SUPER_ADMIN' || role === 'ZELADOR');
  return <ResourcePage title="Ocorrências" eyebrow="OPERAÇÃO" description="Acompanhe e registre situações que precisam de atenção." endpoint="/ocorrencias" columns={[{ key: 'titulo', label: 'Título' }, { key: 'status', label: 'Status' }, { key: 'descricao', label: 'Descrição' }]} fields={[{ key: 'usuario_id', label: 'ID do usuário', placeholder: 'Ex.: 1', required: true }, { key: 'titulo', label: 'Título', placeholder: 'Descreva a ocorrência', required: true }, { key: 'descricao', label: 'Descrição', placeholder: 'Detalhes da situação', required: true }]} renderValue={(row, key, reload) => {
    if (key !== 'status') return String(row[key] ?? '—');
    const status = String(row.status ?? 'aberta');
    if (canChangeStatus) return <StatusSelect id={Number(row.id)} value={status} onChanged={reload} />;
    return <span className={`status-pill ${status === 'resolvida' ? 'success' : 'pending'}`}>{STATUS_LABELS[status] ?? status}</span>;
  }} />;
}
