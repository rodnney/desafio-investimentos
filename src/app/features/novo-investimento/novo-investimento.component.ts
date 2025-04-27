import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InvestimentoService } from '../../core/services/investimento.service';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-novo-investimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CurrencyInputDirective],
  templateUrl: './novo-investimento.component.html',
  styleUrls: ['./novo-investimento.component.scss']
})
export class NovoInvestimentoComponent implements OnInit {
  investimentoForm: FormGroup;
  erroPercentual: boolean = false;
  modo: 'novo' | 'visualizar' | 'editar' = 'novo';
  investimentoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private investimentoService: InvestimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.investimentoForm = this.fb.group({
      nome: ['', Validators.required],
      objetivo: ['', Validators.required],
      saldoTotal: ['', [Validators.required, Validators.min(0.01)]],
      acoes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Detecta modo pela rota
    if (this.router.url.includes('/visualizar')) {
      this.modo = 'visualizar';
    } else if (this.router.url.includes('/editar')) {
      this.modo = 'editar';
    } else {
      this.modo = 'novo';
    }

    this.investimentoId = this.route.snapshot.paramMap.get('id');
    if (this.investimentoId && this.modo !== 'novo') {
      this.investimentoService.getInvestimentos().subscribe(investimentos => {
        const investimento = investimentos.find(inv => inv.nome.trim().toLowerCase() === (this.investimentoId?.trim().toLowerCase() ?? ''));
        if (investimento) {
          this.investimentoForm.patchValue({
            nome: investimento.nome,
            objetivo: investimento.objetivo,
            saldoTotal: investimento.saldoTotal
          });
          this.acoes.clear();
          investimento.acoes.forEach(acao => {
            this.acoes.push(this.fb.group({
              nome: [acao.nome, Validators.required],
              percentual: [acao.percentual, [Validators.required, Validators.min(1), Validators.max(100)]]
            }));
          });
          if (this.modo === 'visualizar') {
            this.investimentoForm.disable();
          } else {
            this.investimentoForm.enable();
          }
        }
      });
    } else {
      // Novo investimento: limpa o form
      this.investimentoForm.reset();
      this.acoes.clear();
    }
  }

  get acoes() {
    return this.investimentoForm.get('acoes') as FormArray;
  }

  adicionarAcao() {
    this.acoes.push(this.fb.group({
      nome: ['', Validators.required],
      percentual: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    }));
  }

  removerAcao(index: number) {
    this.acoes.removeAt(index);
  }

  validarPercentual() {
    const acoes = this.acoes.controls.map(ctrl => ({ percentual: Number(ctrl.get('percentual')?.value) }));
    this.erroPercentual = !this.investimentoService.validarSomaPercentuais(acoes as any);
  }

  salvar() {
    this.validarPercentual();
    if (this.investimentoForm.valid && !this.erroPercentual) {
      if (this.modo === 'editar') {
        // Atualiza investimento existente
        this.investimentoService.salvarInvestimento(this.investimentoForm.value).subscribe({
          next: () => {
            alert('Alterações salvas com sucesso!');
            this.router.navigate(['/investimentos']);
          },
          error: () => {
            alert('Erro ao salvar alterações!');
          }
        });
      } else {
        // Novo investimento
        const novoInvestimento = { ...this.investimentoForm.value };
        // Gera id único se não existir
        if (!novoInvestimento.id) {
          novoInvestimento.id = Date.now();
        }
        this.investimentoService.salvarInvestimento(novoInvestimento).subscribe({
          next: () => {
            alert('Investimento salvo com sucesso!');
            this.router.navigate(['/investimentos']);
          },
          error: () => {
            alert('Erro ao salvar investimento!');
          }
        });
      }
    }
  }

  cancelar() {
    this.router.navigate(['/investimentos']);
  }
}
