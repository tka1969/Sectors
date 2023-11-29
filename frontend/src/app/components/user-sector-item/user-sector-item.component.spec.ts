import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSectorItemComponent } from './user-sector-item.component';

describe('UserSectorItemComponent', () => {
  let component: UserSectorItemComponent;
  let fixture: ComponentFixture<UserSectorItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSectorItemComponent]
    });
    fixture = TestBed.createComponent(UserSectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
