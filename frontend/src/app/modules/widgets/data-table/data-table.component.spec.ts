import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: WidgetDataTableComponent;
  let fixture: ComponentFixture<WidgetDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetDataTableComponent]
    });
    fixture = TestBed.createComponent(WidgetDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
