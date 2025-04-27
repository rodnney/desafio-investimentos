import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Investimento } from '../models/investimento.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private mockInvestimentos: Investimento[] = [
    {
      id: 1,
      nome: 'INVESTIMENTO I',
      objetivo: 'Minha aposentadoria',
      saldoTotal: 39321.29,
      indicadorCarencia: 'N',
      acoes: [
        { id: '1', nome: 'Banco do Brasil (BBAS3)', percentual: 28.1 },
        { id: '2', nome: 'Petrobras (PETR4)', percentual: 71.9 }
      ]
    },
    {
      id: 2,
      nome: 'INVESTIMENTO II',
      objetivo: 'Reserva de emergência',
      saldoTotal: 15000.00,
      indicadorCarencia: 'S',
      acoes: [
        { id: '3', nome: 'Vale (VALE3)', percentual: 100 }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getInvestimentos(): Observable<Investimento[]> {
    return of(this.mockInvestimentos);
  }

  salvarInvestimento(investimento: Investimento): Observable<any> {
    const idx = this.mockInvestimentos.findIndex(i => i.nome === investimento.nome);
    if (idx > -1) {
      this.mockInvestimentos[idx] = { ...investimento };
    } else {
      this.mockInvestimentos.push({ ...investimento });
    }
    return of({ success: true });
  }

  editarInvestimento(nome: string, investimento: Investimento): Observable<any> {
    const idx = this.mockInvestimentos.findIndex(i => i.nome === nome);
    if (idx > -1) {
      this.mockInvestimentos[idx] = { ...investimento };
      return of({ success: true });
    }
    return of({ success: false });
  }

  excluirInvestimento(nome: string): Observable<any> {
    this.mockInvestimentos = this.mockInvestimentos.filter(i => i.nome !== nome);
    return of({ success: true });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }
}
