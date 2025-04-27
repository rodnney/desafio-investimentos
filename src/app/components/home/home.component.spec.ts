import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { InvestmentService } from '../../services/investment.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let investmentServiceSpy: jasmine.SpyObj<InvestmentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockInvestments = {
    response: {
      status: "200",
      data: {
        listaInvestimentos: [
          {
            nome: "INVESTIMENTO I",
            objetivo: "Aposentadoria",
            saldoTotal: 39258.24,
            indicadorCarencia: "N",
            acoes: []
          },
          {
            nome: "INVESTIMENTO II",
            objetivo: "Viagem dos sonhos",
            saldoTotal: 10520.00,
            indicadorCarencia: "S",
            acoes: []
          }
        ]
      }
    }
  };

  beforeEach(async () => {
    investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['getInvestments', 'setSelectedInvestment']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    investmentServiceSpy.getInvestments.and.returnValue(of(mockInvestments));

    await TestBed.configureTestingModule({
      imports: [CommonModule, HomeComponent],
      providers: [
        { provide: InvestmentService, useValue: investmentServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load investments on init', () => {
    expect(investmentServiceSpy.getInvestments).toHaveBeenCalled();
    expect(component.investments.length).toBe(2);
  });

  it('should navigate to detail when investment without grace period is clicked', () => {
    const investment = mockInvestments.response.data.listaInvestimentos[0];
    component.navigateToDetail(investment);
    
    expect(investmentServiceSpy.setSelectedInvestment).toHaveBeenCalledWith(investment);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/investment-detail']);
  });

  it('should not navigate to detail when investment with grace period is clicked', () => {
    const investment = mockInvestments.response.data.listaInvestimentos[1];
    component.navigateToDetail(investment);
    
    expect(investmentServiceSpy.setSelectedInvestment).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should correctly identify investments available for redemption', () => {
    const investmentWithoutGracePeriod = mockInvestments.response.data.listaInvestimentos[0];
    const investmentWithGracePeriod = mockInvestments.response.data.listaInvestimentos[1];
    
    expect(component.isAvailableForRedemption(investmentWithoutGracePeriod)).toBeTrue();
    expect(component.isAvailableForRedemption(investmentWithGracePeriod)).toBeFalse();
  });
});
