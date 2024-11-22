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
import { FinishSignupPageModule } from './finish-signup/finish-signup.module';  // Asegúrate de importar el módulo de FinishSignupPage

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Inicialización de Firebase
    AngularFireAuthModule,  // Módulo de autenticación de Firebase
    FinishSignupPageModule  // Importa el módulo de FinishSignupPage para poder usarla
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
