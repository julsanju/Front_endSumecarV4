import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSalesComponent } from './footer-sales.component';

describe('FooterSalesComponent', () => {
  let component: FooterSalesComponent;
  let fixture: ComponentFixture<FooterSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterSalesComponent]
    });
    fixture = TestBed.createComponent(FooterSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
