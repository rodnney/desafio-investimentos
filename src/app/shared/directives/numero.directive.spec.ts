import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NumeroDirective } from './numero.directive';

@Component({
  template: `<input [(ngModel)]="valor" appNumero />`
})
class TestHostComponent {
  valor = '';
}

describe('NumeroDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumeroDirective, TestHostComponent],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('deve permitir apenas números', () => {
    input.value = 'abc123!@#';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('123');
  });
});
