import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSectorListComponent } from './user-sector-list.component';

describe('UserSectorListComponent', () => {
  let component: UserSectorListComponent;
  let fixture: ComponentFixture<UserSectorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSectorListComponent]
    });
    fixture = TestBed.createComponent(UserSectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
