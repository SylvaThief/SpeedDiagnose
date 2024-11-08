import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FinishSignupPage } from './finish-signup.page';
import { FinishSignupPageRoutingModule } from './finish-signup-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importar módulo de autenticación

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishSignupPageRoutingModule,
    AngularFireAuthModule // Asegurarse de que esté incluido
  ],
  declarations: [FinishSignupPage]
})
export class FinishSignupPageModule {}
