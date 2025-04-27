import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { InvestmentService } from '../../services/investment.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe]
})
export class ErrorModalComponent {
  @Input() errorActions: any[] = [];
  @Input() investment: any;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private investmentService: InvestmentService) {}

  getActionBalance(action: any): number {
    if (this.investment) {
      return this.investmentService.calculateActionBalance(this.investment, action);
    }
    return 0;
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
