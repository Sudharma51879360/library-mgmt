import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberModeComponent } from './member-mode.component';

describe('MemberModeComponent', () => {
  let component: MemberModeComponent;
  let fixture: ComponentFixture<MemberModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
