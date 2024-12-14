import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppFoodApiPage } from './app-food-api.page';

describe('AppFoodApiPage', () => {
  let component: AppFoodApiPage;
  let fixture: ComponentFixture<AppFoodApiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFoodApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
