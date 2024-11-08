import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importación para Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Si necesitas declarar el componente en el módulo principal:
import { FinishSignupPage } from './finish-signup/finish-signup.page';

@NgModule({
  declarations: [AppComponent, FinishSignupPage],  // Declarar el componente aquí
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
