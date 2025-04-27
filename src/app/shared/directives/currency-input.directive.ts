import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[currencyInput]'
})
export class CurrencyInputDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    let value = this.el.value.replace(/\D/g, '');
    value = (parseInt(value, 10) / 100).toFixed(2);
    this.el.value = Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
