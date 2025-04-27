import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SuccessModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  onNewRedemption(): void {
    this.closeModal.emit();
  }
}
