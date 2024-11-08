import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinishSignupPage } from './finish-signup.page';

const routes: Routes = [
  {
    path: '',
    component: FinishSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinishSignupPageRoutingModule {}
