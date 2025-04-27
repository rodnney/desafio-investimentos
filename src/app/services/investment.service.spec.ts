import { TestBed } from '@angular/core/testing';
import { InvestmentService } from './investment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvestmentService]
    });
    service = TestBed.inject(InvestmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get investments from API', () => {
    const mockResponse = {
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
            }
          ]
        }
      }
    };

    service.getInvestments().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/mock-investments.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should calculate action balance correctly', () => {
    const investment = {
      saldoTotal: 10000
    };
    
    const action = {
      percentual: 25
    };

    const balance = service.calculateActionBalance(investment, action);
    expect(balance).toBe(2500);
  });

  it('should validate redemption value correctly', () => {
    expect(service.validateRedemptionValue(1000, 500)).toBeTrue();
    expect(service.validateRedemptionValue(1000, 1000)).toBeTrue();
    expect(service.validateRedemptionValue(1000, 1001)).toBeFalse();
  });
});
