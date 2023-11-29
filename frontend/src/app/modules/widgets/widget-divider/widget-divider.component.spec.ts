import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiceDividerComponent } from './nice-divider.component';

describe('NiceDividerComponent', () => {
  let component: NiceDividerComponent;
  let fixture: ComponentFixture<NiceDividerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NiceDividerComponent]
    });
    fixture = TestBed.createComponent(NiceDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
