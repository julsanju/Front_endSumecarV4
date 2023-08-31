import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSalesComponent } from './header-sales.component';

describe('HeaderSalesComponent', () => {
  let component: HeaderSalesComponent;
  let fixture: ComponentFixture<HeaderSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderSalesComponent]
    });
    fixture = TestBed.createComponent(HeaderSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
