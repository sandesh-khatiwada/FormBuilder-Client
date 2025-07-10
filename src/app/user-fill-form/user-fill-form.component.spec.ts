import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFillFormComponent } from './user-fill-form.component';

describe('UserFillFormComponent', () => {
  let component: UserFillFormComponent;
  let fixture: ComponentFixture<UserFillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFillFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
