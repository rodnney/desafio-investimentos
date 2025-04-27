import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentDetailComponent } from './investment-detail.component';
import { InvestmentService } from '../../services/investment.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

describe('InvestmentDetailComponent', () => {
  let component: InvestmentDetailComponent;
  let fixture: ComponentFixture<InvestmentDetailComponent>;
  let investmentServiceSpy: jasmine.SpyObj<InvestmentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockInvestment = {
    nome: "INVESTIMENTO III",
    objetivo: "Abrir meu próprio negócio",
    saldoTotal: 123800.45,
    indicadorCarencia: "N",
    acoes: [
      {
        id: "1",
        nome: "Banco do Brasil (BBAS3)",
        percentual: 10.0
      },
      {
        id: "2",
        nome: "Vale (VALE3)",
        percentual: 62.0
      },
      {
        id: "3",
        nome: "Petrobras (PETR4)",
        percentual: 28.0
      }
    ]
  };

  beforeEach(async () => {
    investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['getSelectedInvestment', 'calculateActionBalance']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    investmentServiceSpy.getSelectedInvestment.and.returnValue(of(mockInvestment));
    investmentServiceSpy.calculateActionBalance.and.callFake((investment, action) => {
      return (investment.saldoTotal * action.percentual) / 100;
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, InvestmentDetailComponent, SuccessModalComponent, ErrorModalComponent],
      providers: [
        { provide: InvestmentService, useValue: investmentServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load investment on init', () => {
    expect(investmentServiceSpy.getSelectedInvestment).toHaveBeenCalled();
    expect(component.investment).toEqual(mockInvestment);
  });

  it('should initialize redemption values to zero', () => {
    mockInvestment.acoes.forEach(action => {
      expect(component.redemptionValues[action.id]).toBe(0);
    });
  });

  it('should calculate action balance correctly', () => {
    const action = mockInvestment.acoes[0];
    const expectedBalance = (mockInvestment.saldoTotal * action.percentual) / 100;
    
    expect(component.getActionBalance(action)).toBe(expectedBalance);
    expect(investmentServiceSpy.calculateActionBalance).toHaveBeenCalledWith(mockInvestment, action);
  });

  it('should update total redemption value when redemption values change', () => {
    component.redemptionValues = {
      "1": 1000,
      "2": 2000,
      "3": 3000
    };
    
    component.updateTotalRedemptionValue();
    expect(component.totalRedemptionValue).toBe(6000);
  });

  it('should mark error when redemption value exceeds action balance', () => {
    const action = mockInvestment.acoes[0];
    const actionBalance = component.getActionBalance(action);
    
    component.onRedemptionValueChange(action.id, actionBalance + 100, action);
    expect(component.errors[action.id]).toBeTrue();
  });

  it('should not mark error when redemption value is within action balance', () => {
    const action = mockInvestment.acoes[0];
    const actionBalance = component.getActionBalance(action);
    
    component.onRedemptionValueChange(action.id, actionBalance - 100, action);
    expect(component.errors[action.id]).toBeFalse();
  });

  it('should show success modal when all redemption values are valid', () => {
    mockInvestment.acoes.forEach(action => {
      const actionBalance = component.getActionBalance(action);
      component.redemptionValues[action.id] = actionBalance - 100;
    });
    
    component.confirmRedemption();
    expect(component.showSuccessModal).toBeTrue();
    expect(component.showErrorModal).toBeFalse();
  });

  it('should show error modal when any redemption value is invalid', () => {
    mockInvestment.acoes.forEach(action => {
      const actionBalance = component.getActionBalance(action);
      component.redemptionValues[action.id] = actionBalance - 100;
    });
    
    // Make one value invalid
    const invalidAction = mockInvestment.acoes[0];
    const actionBalance = component.getActionBalance(invalidAction);
    component.redemptionValues[invalidAction.id] = actionBalance + 100;
    
    component.confirmRedemption();
    expect(component.showSuccessModal).toBeFalse();
    expect(component.showErrorModal).toBeTrue();
    expect(component.errorActions).toContain(invalidAction);
  });

  it('should navigate back to home when goBack is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
