import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPeticionesComponent } from './view-peticiones.component';

describe('ViewPeticionesComponent', () => {
  let component: ViewPeticionesComponent;
  let fixture: ComponentFixture<ViewPeticionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPeticionesComponent]
    });
    fixture = TestBed.createComponent(ViewPeticionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
