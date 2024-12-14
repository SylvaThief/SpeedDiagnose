import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppFoodApiPageRoutingModule } from './app-food-api-routing.module';

import { AppFoodApiPage } from './app-food-api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppFoodApiPageRoutingModule
  ],
  declarations: [AppFoodApiPage]
})
export class AppFoodApiPageModule {}
