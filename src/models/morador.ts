export type TipoVinculoMorador = 'proprietario' | 'inquilino' | 'dependente';

export interface Morador {
  id: number;
  usuarioId: number;
  unidadeId: number;
  tipoVinculo: TipoVinculoMorador;
  criadoEm?: Date | null;
}
