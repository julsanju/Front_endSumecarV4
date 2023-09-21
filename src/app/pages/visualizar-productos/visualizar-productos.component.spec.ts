import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarProductosComponent } from './visualizar-productos.component';

describe('VisualizarProductosComponent', () => {
  let component: VisualizarProductosComponent;
  let fixture: ComponentFixture<VisualizarProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarProductosComponent]
    });
    fixture = TestBed.createComponent(VisualizarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
