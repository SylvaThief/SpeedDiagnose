// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importación para Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Importa FinishSignupPageModule para usar la página
import { FinishSignupPageModule } from './finish-signup/finish-signup.module';  // Importar el módulo de la página

@NgModule({
  declarations: [AppComponent],  // No declarar FinishSignupPage aquí
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FinishSignupPageModule  // Importar el módulo de FinishSignupPage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
