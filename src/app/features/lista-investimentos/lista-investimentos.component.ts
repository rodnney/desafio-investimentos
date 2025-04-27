import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Investimento } from '../../core/models/investimento.model';
import { InvestimentoService } from '../../core/services/investimento.service';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-investimentos',
  standalone: true,
  imports: [CommonModule, MoedaPipe],
  templateUrl: './lista-investimentos.component.html',
  styleUrls: ['./lista-investimentos.component.scss']
})
export class ListaInvestimentosComponent implements OnInit {
  investimentos: Investimento[] = [];

  constructor(private investimentoService: InvestimentoService, private router: Router) {}

  ngOnInit(): void {
    this.investimentoService.getInvestimentos().subscribe((data: Investimento[]) => {
      this.investimentos = data;
    });
  }

  podeResgatar(investimento: Investimento): boolean {
    return !this.investimentoService.possuiCarencia(investimento);
  }

  onVisualizar(investimento: Investimento): void {
    this.router.navigate(['/investimentos', investimento.nome, 'visualizar']);
  }

  onEditar(investimento: Investimento): void {
    this.router.navigate(['/investimentos', investimento.nome, 'editar']);
  }

  onExcluir(investimento: Investimento): void {
    if (confirm('Deseja realmente excluir este investimento?')) {
      this.investimentos = this.investimentos.filter(i => i !== investimento);
      // Aqui você pode também chamar o serviço para remover do backend
    }
  }

  onNovoInvestimento(): void {
    this.router.navigate(['/investimentos/novo']);
  }

  onResgatar(investimento: Investimento): void {
    if (this.podeResgatar(investimento)) {
      this.router.navigate(['/investimentos', investimento.id, 'resgate']);
    }
  }
}
