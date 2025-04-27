import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumero]'
})
export class NumeroDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.control.control?.setValue(value, { emitEvent: false });
  }
}
