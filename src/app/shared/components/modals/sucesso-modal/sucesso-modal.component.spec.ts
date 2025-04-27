import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SucessoModalComponent } from './sucesso-modal.component';
import { By } from '@angular/platform-browser';

describe('SucessoModalComponent', () => {
  let component: SucessoModalComponent;
  let fixture: ComponentFixture<SucessoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SucessoModalComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(SucessoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir mensagem de sucesso', () => {
    const h2 = fixture.debugElement.query(By.css('h2'));
    expect(h2.nativeElement.textContent).toContain('RESGATE EFETUADO COM SUCESSO!');
  });
});
