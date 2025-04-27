import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorModalComponent } from './error-modal.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { InvestmentService } from '../../services/investment.service';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let investmentServiceSpy: jasmine.SpyObj<InvestmentService>;

  const mockInvestment = {
    nome: "INVESTIMENTO III",
    objetivo: "Abrir meu próprio negócio",
    saldoTotal: 123800.45,
    indicadorCarencia: "N",
    acoes: []
  };

  const mockErrorActions = [
    {
      id: "1",
      nome: "Banco do Brasil (BBAS3)",
      percentual: 10.0
    }
  ];

  beforeEach(async () => {
    investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['calculateActionBalance']);
    investmentServiceSpy.calculateActionBalance.and.returnValue(12380.045);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ErrorModalComponent],
      providers: [
        { provide: InvestmentService, useValue: investmentServiceSpy },
        DecimalPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    component.investment = mockInvestment;
    component.errorActions = mockErrorActions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate action balance correctly', () => {
    const action = mockErrorActions[0];
    component.getActionBalance(action);
    expect(investmentServiceSpy.calculateActionBalance).toHaveBeenCalledWith(mockInvestment, action);
  });

  it('should emit closeModal event when onClose is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
