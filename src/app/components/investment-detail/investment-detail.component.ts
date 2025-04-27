import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvestmentService } from '../../services/investment.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-investment-detail',
  templateUrl: './investment-detail.component.html',
  styleUrls: ['./investment-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessModalComponent, ErrorModalComponent, DecimalPipe]
})
export class InvestmentDetailComponent implements OnInit {
  investment: any;
  redemptionValues: { [key: string]: number } = {};
  totalRedemptionValue: number = 0;
  errors: { [key: string]: boolean } = {};
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  errorActions: any[] = [];

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.investmentService.getSelectedInvestment().subscribe(investment => {
      if (investment) {
        this.investment = investment;
        // Inicializar os valores de resgate como zero
        this.investment.acoes.forEach((action: any) => {
          this.redemptionValues[action.id] = 0;
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getActionBalance(action: any): number {
    return this.investmentService.calculateActionBalance(this.investment, action);
  }

  updateTotalRedemptionValue(): void {
    this.totalRedemptionValue = Object.values(this.redemptionValues).reduce((sum, value) => sum + (value || 0), 0);
  }

  onRedemptionValueChange(actionId: string, value: number, action: any): void {
    this.redemptionValues[actionId] = value;
    const actionBalance = this.getActionBalance(action);
    this.errors[actionId] = value > actionBalance;
    this.updateTotalRedemptionValue();
  }

  confirmRedemption(): void {
    const invalidActions = this.investment.acoes.filter((action: any) => 
      this.redemptionValues[action.id] > this.getActionBalance(action)
    );

    if (invalidActions.length > 0) {
      this.errorActions = invalidActions;
      this.showErrorModal = true;
    } else {
      this.showSuccessModal = true;
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
