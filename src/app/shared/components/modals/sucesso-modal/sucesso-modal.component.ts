import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sucesso-modal',
  templateUrl: './sucesso-modal.component.html',
  styleUrls: ['./sucesso-modal.component.scss']
})
export class SucessoModalComponent {
  @Output() close = new EventEmitter<void>();
}

