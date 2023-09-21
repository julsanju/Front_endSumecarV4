import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCantidadPComponent } from './modal-cantidad-p.component';

describe('ModalCantidadPComponent', () => {
  let component: ModalCantidadPComponent;
  let fixture: ComponentFixture<ModalCantidadPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCantidadPComponent]
    });
    fixture = TestBed.createComponent(ModalCantidadPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
