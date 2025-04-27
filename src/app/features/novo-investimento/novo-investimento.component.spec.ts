import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NovoInvestimentoComponent } from './novo-investimento.component';

describe('NovoInvestimentoComponent', () => {
  let component: NovoInvestimentoComponent;
  let fixture: ComponentFixture<NovoInvestimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NovoInvestimentoComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(NovoInvestimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve adicionar e remover ações', () => {
    component.adicionarAcao();
    expect(component.acoes.length).toBe(1);
    component.removerAcao(0);
    expect(component.acoes.length).toBe(0);
  });

  it('deve validar soma dos percentuais igual a 100', () => {
    component.adicionarAcao();
    component.acoes.at(0).get('percentual')?.setValue(60);
    component.adicionarAcao();
    component.acoes.at(1).get('percentual')?.setValue(40);
    component.validarPercentual();
    expect(component.erroPercentual).toBe(false);
    component.acoes.at(1).get('percentual')?.setValue(30);
    component.validarPercentual();
    expect(component.erroPercentual).toBe(true);
  });
});
