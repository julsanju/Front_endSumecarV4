import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSalesComponent } from './login-sales.component';

describe('LoginSalesComponent', () => {
  let component: LoginSalesComponent;
  let fixture: ComponentFixture<LoginSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginSalesComponent]
    });
    fixture = TestBed.createComponent(LoginSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
