import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessModalComponent } from './success-modal.component';
import { CommonModule } from '@angular/common';

describe('SuccessModalComponent', () => {
  let component: SuccessModalComponent;
  let fixture: ComponentFixture<SuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, SuccessModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal event when onNewRedemption is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onNewRedemption();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
