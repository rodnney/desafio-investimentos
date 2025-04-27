import { Acao } from './acao.model';

export interface Investimento {
  id: number;
  nome: string;
  objetivo: string;
  saldoTotal: number;
  indicadorCarencia: string;
  acoes: Acao[];
}

export type { Acao } from './acao.model';
