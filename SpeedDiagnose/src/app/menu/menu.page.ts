import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa Firebase Auth

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

  // Función para el login (Inicio de sesión)
  async onLogin() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (userCredential.user) {
        this.router.navigate(['/home']);  // Redirige al usuario al 'home'
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

  // Función para el registro (enviar código de verificación por correo)
  async onRegister() {
    try {
      const actionCodeSettings = {
        // Enlace con el cual se enviará el código de verificación
        url: `${window.location.origin}/finish-signup`,  // Cambia según tu ruta de finalización
        handleCodeInApp: true  // Esto asegura que el código sea gestionado dentro de la app
      };

      // Enviar un enlace de verificación al correo ingresado
      await this.afAuth.sendSignInLinkToEmail(this.email, actionCodeSettings);

      // Guardar el correo localmente para completar el registro más tarde
      localStorage.setItem('emailForSignIn', this.email);

      const alert = await this.alertController.create({
        header: 'Verificación enviada',
        message: 'Te hemos enviado un código de verificación a tu correo electrónico.',
        buttons: ['OK']
      });
      await alert.present();

      // Redirigir a la página de "finish-signup"
      this.router.navigate(['/finish-signup']);
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
