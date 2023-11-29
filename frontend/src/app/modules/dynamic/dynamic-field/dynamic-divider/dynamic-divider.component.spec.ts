import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDividerComponent } from './dynamic-divider.component';

describe('DynamicDividerComponent', () => {
  let component: DynamicDividerComponent;
  let fixture: ComponentFixture<DynamicDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDividerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
