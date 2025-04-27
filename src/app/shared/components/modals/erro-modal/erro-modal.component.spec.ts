import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErroModalComponent } from './erro-modal.component';
import { By } from '@angular/platform-browser';
import { MoedaPipe } from '../../../pipes/moeda.pipe';

describe('ErroModalComponent', () => {
  let component: ErroModalComponent;
  let fixture: ComponentFixture<ErroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErroModalComponent, MoedaPipe]
    }).compileComponents();
    fixture = TestBed.createComponent(ErroModalComponent);
    component = fixture.componentInstance;
    component.erros = [
      { acao: 'Ação 1', saldo: 100 },
      { acao: 'Ação 2', saldo: 50 }
    ];
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erros na tela', () => {
    const itens = fixture.debugElement.queryAll(By.css('li'));
    expect(itens.length).toBe(2);
    expect(itens[0].nativeElement.textContent).toContain('Ação 1');
    expect(itens[1].nativeElement.textContent).toContain('Ação 2');
  });
});
