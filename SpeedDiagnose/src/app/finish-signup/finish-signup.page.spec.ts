import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishSignupPage } from './finish-signup.page';

describe('FinishSignupPage', () => {
  let component: FinishSignupPage;
  let fixture: ComponentFixture<FinishSignupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
