import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenaComponent } from './cambiar-contrasena.component';

describe('CambiarContrasenaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CambiarContrasenaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CambiarContrasenaComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('stepper app is running!');
  });
});
