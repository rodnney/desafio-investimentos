import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Investimento } from '../models/investimento.model';
import { Acao } from '../models/acao.model';

@Injectable({ providedIn: 'root' })
export class InvestimentoService {
  constructor(private api: ApiService) {}

  getInvestimentos(): Observable<Investimento[]> {
    return this.api.getInvestimentos();
  }

  salvarInvestimento(investimento: Investimento): Observable<any> {
    return this.api.salvarInvestimento(investimento);
  }

  validarSomaPercentuais(acoes: Acao[]): boolean {
    const soma = acoes.reduce((acc, acao) => acc + Number(acao.percentual), 0);
    return Math.abs(soma - 100) < 0.01;
  }

  possuiCarencia(investimento: Investimento): boolean {
    return investimento.indicadorCarencia === 'S';
  }
}
