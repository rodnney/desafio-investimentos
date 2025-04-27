import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Investimento } from '../../core/models/investimento.model';
import { Acao } from '../../core/models/acao.model';
import { InvestimentoService } from '../../core/services/investimento.service';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';
import { ErroModalComponent } from '../../shared/components/modals/erro-modal/erro-modal.component';
import { SucessoModalComponent } from '../../shared/components/modals/sucesso-modal/sucesso-modal.component';

@Component({
  selector: 'app-resgate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MoedaPipe,
    CurrencyInputDirective,
    ErroModalComponent,
    SucessoModalComponent
  ],
  templateUrl: './resgate.component.html',
  styleUrls: ['./resgate.component.scss']
})
export class ResgateComponent implements OnInit {
  investimento?: Investimento;
  valorTotalResgate = 0;
  valorResgate: { [key: string]: number } = {};
  validationErrors = new Map<string, boolean>();
  hasValidationError = false;
  showErrorModal = false;
  showSuccessModal = false;
  errorActions: { acao: string, saldo: number }[] = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private investimentoService: InvestimentoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.investimentoService.getInvestimentos().subscribe(investimentos => {
        this.investimento = investimentos.find(inv => inv.id === Number(id));
        if (!this.investimento) {
          this.router.navigate(['/investimentos']);
        } else {
          // Inicializa os valores de resgate como zero
          this.investimento.acoes.forEach(acao => {
            this.valorResgate[acao.id] = 0;
          });
        }
      });
    }
  }

  getSaldoAcumulado(acao: Acao): number {
    if (!this.investimento) return 0;
    return Number(((this.investimento.saldoTotal * acao.percentual) / 100).toFixed(2));
  }

  atualizarValorTotalResgate(): void {
    if (!this.investimento) return;
    this.valorTotalResgate = 0;
    this.validationErrors.clear();
    this.hasValidationError = false;
    this.errorActions = [];
    let algumResgateValido = false;

    this.investimento.acoes.forEach(acao => {
      const valor = Number(this.valorResgate[acao.id]) || 0;
      const saldoAcumulado = this.getSaldoAcumulado(acao);
      // Valor negativo ou acima do saldo
      if (valor < 0 || valor > saldoAcumulado) {
        this.validationErrors.set(acao.id, true);
        this.hasValidationError = true;
        this.errorActions.push({ acao: acao.nome, saldo: saldoAcumulado });
      }
      // Só conta como válido se for maior que zero e não tiver erro
      if (valor > 0 && valor <= saldoAcumulado) {
        algumResgateValido = true;
      }
      this.valorTotalResgate += valor;
    });
    // Não permite resgate se nenhum valor válido foi preenchido
    if (!algumResgateValido) {
      this.hasValidationError = true;
    }
  }

  confirmarResgate(): void {
    console.log('[DEBUG] Botão CONFIRMAR RESGATE clicado', {
      investimento: this.investimento,
      valorTotalResgate: this.valorTotalResgate,
      hasValidationError: this.hasValidationError
    });
    if (!this.investimento) return;
    this.atualizarValorTotalResgate();
    if (this.hasValidationError || this.valorTotalResgate <= 0) {
      this.showErrorModal = true;
      return;
    }
    // Atualiza saldos das ações de acordo com o valor resgatado
    const saldoTotalAntes = this.investimento.saldoTotal;
    const novoSaldoTotal = saldoTotalAntes - this.valorTotalResgate;
    const acoesAtualizadas = this.investimento.acoes.map(acao => {
      const valorResgate = Number(this.valorResgate[acao.id]) || 0;
      const saldoAcumuladoAntes = (saldoTotalAntes * acao.percentual) / 100;
      const saldoAcumuladoDepois = saldoAcumuladoAntes - valorResgate;
      // Novo percentual da ação sobre o novo saldo total
      const novoPercentual = novoSaldoTotal > 0 ? (saldoAcumuladoDepois / novoSaldoTotal) * 100 : 0;
      return {
        ...acao,
        percentual: Number(novoPercentual.toFixed(2))
      };
    });
    const investimentoAtualizado: Investimento = {
      ...this.investimento,
      saldoTotal: Number(novoSaldoTotal.toFixed(2)),
      acoes: acoesAtualizadas
    };
    this.investimentoService.salvarInvestimento(investimentoAtualizado).subscribe({
      next: () => {
        console.log('[DEBUG] Resgate salvo com sucesso, exibindo modal de sucesso');
        this.investimento = investimentoAtualizado; // Garante dados atualizados para o próximo resgate
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('[DEBUG] Erro ao salvar resgate', err);
        this.errorActions = [{ acao: 'Erro', saldo: 0 }];
        this.showErrorModal = true;
      }
    });
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  onNovoResgate(): void {
    // Fecha o modal e redireciona para a tela de resgate do mesmo investimento, com dados atualizados
    this.showSuccessModal = false;
    if (this.investimento) {
      this.router.navigate(['/investimentos', this.investimento.id, 'resgate']);
      // Não recarrega a página, pois os dados já foram atualizados localmente
    }
  }

  onCorrigirErro(): void {
    // Apenas fecha o modal de erro para permitir correção dos valores
    this.showErrorModal = false;
  }

  onValorResgateChange(acaoId: string, valor: string): void {
    // Converter valor monetário string para número
    let valorNum = 0;
    if (typeof valor === 'string') {
      valorNum = Number(valor.replace(/[^0-9,-]+/g, '').replace(',', '.'));
      if (isNaN(valorNum)) valorNum = 0;
    } else {
      valorNum = Number(valor) || 0;
    }
    this.valorResgate[acaoId] = valorNum;
    this.atualizarValorTotalResgate();
  }
}
