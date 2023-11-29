import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFillerComponent } from './dynamic-filler.component';

describe('DynamicFillerComponent', () => {
  let component: DynamicFillerComponent;
  let fixture: ComponentFixture<DynamicFillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
