import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppFoodApiPage } from './app-food-api.page';

const routes: Routes = [
  {
    path: '',
    component: AppFoodApiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppFoodApiPageRoutingModule {}
