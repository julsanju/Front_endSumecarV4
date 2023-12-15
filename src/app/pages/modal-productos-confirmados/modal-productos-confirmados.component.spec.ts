import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductosConfirmadosComponent } from './modal-productos-confirmados.component';

describe('ModalProductosConfirmadosComponent', () => {
  let component: ModalProductosConfirmadosComponent;
  let fixture: ComponentFixture<ModalProductosConfirmadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProductosConfirmadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalProductosConfirmadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
