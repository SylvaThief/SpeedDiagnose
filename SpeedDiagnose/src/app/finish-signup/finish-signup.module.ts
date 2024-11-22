import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FinishSignupPage } from './finish-signup.page'; // Asegúrate de importar correctamente
import { FinishSignupPageRoutingModule } from './finish-signup-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importar módulo de autenticación

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de importar FormsModule para usar ngModel
    IonicModule,
    FinishSignupPageRoutingModule,
    AngularFireAuthModule // Asegúrate de incluir el módulo de autenticación si lo estás usando
  ],
  declarations: [FinishSignupPage] // Usa 'FinishSignupPage' aquí
})
export class FinishSignupPageModule {}
