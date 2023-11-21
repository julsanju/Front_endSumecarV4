import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPeticionesComponent } from './historial-peticiones.component';

describe('HistorialPeticionesComponent', () => {
  let component: HistorialPeticionesComponent;
  let fixture: ComponentFixture<HistorialPeticionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialPeticionesComponent]
    });
    fixture = TestBed.createComponent(HistorialPeticionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
