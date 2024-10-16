import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAppareanceComponent } from './change-appareance.component';

describe('ChangeAppareanceComponent', () => {
  let component: ChangeAppareanceComponent;
  let fixture: ComponentFixture<ChangeAppareanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeAppareanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeAppareanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
