import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda'
})
export class MoedaPipe implements PipeTransform {
  transform(value: number): string {
    return value != null ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
  }
}
