import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesPendientesComponent } from './mensajes-pendientes.component';

describe('MensajesPendientesComponent', () => {
  let component: MensajesPendientesComponent;
  let fixture: ComponentFixture<MensajesPendientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajesPendientesComponent]
    });
    fixture = TestBed.createComponent(MensajesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
