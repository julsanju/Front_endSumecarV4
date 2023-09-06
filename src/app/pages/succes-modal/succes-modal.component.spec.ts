import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesModalComponent } from './succes-modal.component';

describe('SuccesModalComponent', () => {
  let component: SuccesModalComponent;
  let fixture: ComponentFixture<SuccesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccesModalComponent]
    });
    fixture = TestBed.createComponent(SuccesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
