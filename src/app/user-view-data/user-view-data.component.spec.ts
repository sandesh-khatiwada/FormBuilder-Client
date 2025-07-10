import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewDataComponent } from './user-view-data.component';

describe('UserViewDataComponent', () => {
  let component: UserViewDataComponent;
  let fixture: ComponentFixture<UserViewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
