export interface Ocorrencia {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  usuarioId: number;
  dataCriacao: Date;
}