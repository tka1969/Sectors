import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiceSpacerComponent } from './nice-spacer.component';

describe('NiceSpacerComponent', () => {
  let component: NiceSpacerComponent;
  let fixture: ComponentFixture<NiceSpacerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NiceSpacerComponent]
    });
    fixture = TestBed.createComponent(NiceSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
