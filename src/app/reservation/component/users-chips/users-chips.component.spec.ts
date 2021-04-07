import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChipsComponent } from './users-chips.component';

describe('UsersChipsComponent', () => {
  let component: UsersChipsComponent;
  let fixture: ComponentFixture<UsersChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
