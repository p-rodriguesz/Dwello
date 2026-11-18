export type StatusOcorrencia = 'aberta' | 'em_andamento' | 'resolvida' | 'cancelada';

export interface Ocorrencia {
  id: number;
  unidadeId: number | null;
  usuarioId: number;
  titulo: string;
  descricao: string;
  status: StatusOcorrencia;
  criadoEm?: Date | null;
}