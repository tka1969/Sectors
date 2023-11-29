import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSectorComponent } from './select-sector.component';

describe('SelectSectorComponent', () => {
  let component: SelectSectorComponent;
  let fixture: ComponentFixture<SelectSectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectSectorComponent]
    });
    fixture = TestBed.createComponent(SelectSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
