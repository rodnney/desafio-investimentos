import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResgateComponent } from './resgate.component';
import { InvestimentoService } from '../../core/services/investimento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';
import { ErroModalComponent } from '../../shared/components/modals/erro-modal/erro-modal.component';
import { SucessoModalComponent } from '../../shared/components/modals/sucesso-modal/sucesso-modal.component';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';
import { By } from '@angular/platform-browser';

const mockInvestimento = {
  id: 1,
  nome: 'INVESTIMENTO TESTE',
  objetivo: 'Objetivo Teste',
  saldoTotal: 2000,
  indicadorCarencia: 'N',
  acoes: [
    { id: '1', nome: 'Ação 1', percentual: 50 },
    { id: '2', nome: 'Ação 2', percentual: 50 }
  ]
};

class MockInvestimentoService {
  getInvestimentos() { return of([mockInvestimento]); }
  salvarInvestimento(investimento: any) { return of({ success: true }); }
}

describe('ResgateComponent', () => {
  let component: ResgateComponent;
  let fixture: ComponentFixture<ResgateComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: any;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = { snapshot: { params: { id: 1 } } };
    await TestBed.configureTestingModule({
      imports: [FormsModule, MoedaPipe, ErroModalComponent, SucessoModalComponent, CurrencyInputDirective],
      providers: [
        { provide: InvestimentoService, useClass: MockInvestimentoService },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub }
      ],
      declarations: [ResgateComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ResgateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e exibir dados do investimento', () => {
    expect(component).toBeTruthy();
    expect(component.investimento?.nome).toBe('INVESTIMENTO TESTE');
    expect(component.investimento?.acoes.length).toBe(2);
  });

  it('deve calcular saldo acumulado corretamente', () => {
    const acao = mockInvestimento.acoes[0];
    expect(component.getSaldoAcumulado(acao)).toBe(1000);
  });

  it('deve validar valor de resgate maior que saldo acumulado e exibir erro', fakeAsync(() => {
    component.valorResgate['1'] = 1500; // maior que saldo acumulado
    component.onValorResgateChange('1', 1500);
    fixture.detectChanges();
    expect(component.hasValidationError).toBeTrue();
    expect(component.validationErrors.get('1')).toBeTrue();
  }));

  it('deve permitir resgate válido e mostrar modal de sucesso', fakeAsync(() => {
    component.valorResgate['1'] = 500;
    component.valorResgate['2'] = 500;
    component.onValorResgateChange('1', 500);
    component.onValorResgateChange('2', 500);
    fixture.detectChanges();
    component.confirmarResgate();
    tick();
    fixture.detectChanges();
    expect(component.showSuccessModal).toBeTrue();
  }));

  it('deve mostrar modal de erro se confirmar com valor inválido', fakeAsync(() => {
    component.valorResgate['1'] = 1500;
    component.valorResgate['2'] = 0;
    component.onValorResgateChange('1', 1500);
    fixture.detectChanges();
    component.confirmarResgate();
    tick();
    fixture.detectChanges();
    expect(component.showErrorModal).toBeTrue();
  }));

  it('deve recalcular percentuais após resgate', fakeAsync(() => {
    component.valorResgate['1'] = 200;
    component.valorResgate['2'] = 0;
    component.onValorResgateChange('1', 200);
    fixture.detectChanges();
    component.confirmarResgate();
    tick();
    fixture.detectChanges();
    // Após resgate, percentual da ação 1 deve ser 40% e da ação 2, 60%
    expect(component.investimento?.acoes[0].percentual).toBeCloseTo(40, 1);
    expect(component.investimento?.acoes[1].percentual).toBeCloseTo(60, 1);
  }));

  it('deve reiniciar fluxo ao clicar em NOVO RESGATE', () => {
    component.investimento = mockInvestimento;
    component.showSuccessModal = true;
    component.onNovoResgate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/investimentos', mockInvestimento.id, 'resgate']);
  });
});
