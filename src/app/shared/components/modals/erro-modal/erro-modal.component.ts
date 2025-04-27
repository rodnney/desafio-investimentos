import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoedaPipe } from '../../../pipes/moeda.pipe';

@Component({
  selector: 'app-erro-modal',
  standalone: true,
  imports: [CommonModule, MoedaPipe],
  templateUrl: './erro-modal.component.html',
  styleUrls: ['./erro-modal.component.scss']
})
export class ErroModalComponent {
  @Input() erros: { acao: string, saldo: number }[] = [];
  @Output() corrigir = new EventEmitter<void>();
}

