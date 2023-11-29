import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRicheditComponent } from './dynamic-richedit.component';

describe('DynamicRicheditComponent', () => {
  let component: DynamicRicheditComponent;
  let fixture: ComponentFixture<DynamicRicheditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRicheditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicRicheditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
