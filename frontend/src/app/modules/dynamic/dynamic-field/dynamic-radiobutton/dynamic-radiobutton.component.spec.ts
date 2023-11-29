import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRadiobuttonComponent } from './dynamic-radiobutton.component';

describe('DynamicRadioComponent', () => {
  let component: DynamicRadiobuttonComponent;
  let fixture: ComponentFixture<DynamicRadiobuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRadiobuttonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicRadiobuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
