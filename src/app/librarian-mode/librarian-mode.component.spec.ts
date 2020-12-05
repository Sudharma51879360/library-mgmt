import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianModeComponent } from './librarian-mode.component';

describe('LibrarianModeComponent', () => {
  let component: LibrarianModeComponent;
  let fixture: ComponentFixture<LibrarianModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrarianModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarianModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
