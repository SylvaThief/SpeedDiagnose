import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importamos AngularFireAuth
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-finish-signup',
  templateUrl: './finish-signup.page.html',
  styleUrls: ['./finish-signup.page.scss'],
})
export class FinishSignupPage {

  email: string = '';  // Email ingresado por el usuario
  verificationCode: string = '';  // Código de verificación enviado por email

  constructor(
    private afAuth: AngularFireAuth,  // Para usar Firebase Authentication
    private router: Router,
    private alertController: AlertController
  ) {}

  // Enviar el código de verificación
  async sendVerificationCode() {
    try {
      const actionCodeSettings = {
        // Configuración de la URL a la que redirigir después de la verificación
        url: `${window.location.origin}/finish-signup`,  // Cambia esta URL según sea necesario
        handleCodeInApp: true,
      };

      // Enviar correo de verificación con un código
      await this.afAuth.sendSignInLinkToEmail(this.email, actionCodeSettings);

      // Guardar email localmente para confirmar más tarde
      window.localStorage.setItem('emailForSignIn', this.email);

      const alert = await this.alertController.create({
        header: 'Verificación',
        message: 'Te hemos enviado un código de verificación a tu correo.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message,  // Usamos 'error.message' para obtener el mensaje de error
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Verificar el código ingresado
  async verifyCode() {
    const email = window.localStorage.getItem('emailForSignIn');
    if (email) {
      try {
        // Verificar si el enlace de verificación es válido
        const isValidLink = await this.afAuth.isSignInWithEmailLink(window.location.href);

        if (isValidLink) {
          // Completar el proceso de verificación usando el enlace
          await this.afAuth.signInWithEmailLink(email, window.location.href);

          // Limpiar el email guardado
          window.localStorage.removeItem('emailForSignIn');

          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Registro completado correctamente.',
            buttons: ['OK']
          });
          await alert.present();

          // Redirigir al usuario a la página de inicio
          this.router.navigate(['/home']);
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'El enlace de verificación es inválido o ha expirado.',
            buttons: ['OK']
          });
          await alert.present();
        }
      } catch (error: any) {  // Añadimos manejo de error
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.message,  // Mostrar el mensaje de error real
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

}
