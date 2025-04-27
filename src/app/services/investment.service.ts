import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Investimento } from '../core/models/investimento.model';
import { Acao } from '../core/models/acao.model';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private selectedInvestment = new BehaviorSubject<Investimento | null>(null);

  constructor(public apiService: ApiService) { }

  getInvestments(): Observable<Investimento[]> {
    return this.apiService.getInvestimentos();
  }

  getInvestimentoById(id: string): Observable<Investimento | undefined> {
    return this.getInvestments().pipe(
      map((investimentos: Investimento[]) => {
        return investimentos.find(inv => String(inv.id) === String(id));
      })
    );
  }

  setSelectedInvestment(investment: Investimento): void {
    this.selectedInvestment.next(investment);
  }

  getSelectedInvestment(): Observable<Investimento | null> {
    return this.selectedInvestment.asObservable();
  }

  // Método para calcular o saldo acumulado de cada ação
  calculateActionBalance(investment: Investimento, action: Acao): number {
    return (investment.saldoTotal * action.percentual) / 100;
  }

  // Método para validar o valor de resgate
  validateRedemptionValue(actionBalance: number, redemptionValue: number): boolean {
    return redemptionValue <= actionBalance;
  }
}
