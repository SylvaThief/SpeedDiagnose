import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private afAuth: AngularFireAuth // Firebase Authentication
  ) {}

  // Función para el login
  async onLogin() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (userCredential.user) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Función para el registro (envío del código de verificación)
  async onRegister() {
    try {
      const actionCodeSettings = {
        // El enlace será enviado con este parámetro de retorno
        url: `${window.location.origin}/finish-signup`,
        handleCodeInApp: true
      };

      // Enviar un enlace de verificación a este correo electrónico
      await this.afAuth.sendSignInLinkToEmail(this.email, actionCodeSettings);

      // Guardar el correo en el almacenamiento local para poder completarlo después
      localStorage.setItem('emailForSignIn', this.email);

      const alert = await this.alertController.create({
        header: 'Verificación enviada',
        message: 'Te hemos enviado un código de verificación a tu correo electrónico.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al enviar el código de verificación.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
