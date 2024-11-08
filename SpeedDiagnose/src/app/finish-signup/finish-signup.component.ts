import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-finish-signup',
  templateUrl: './finish-signup.page.html',
  styleUrls: ['./finish-signup.page.scss'],
})
export class FinishSignupPage {

  constructor(
    private afAuth: AngularFireAuth, // Firebase Authentication
    private alertController: AlertController, // Para mostrar alertas
    private route: ActivatedRoute // Para acceder a parámetros de la URL
  ) {}

  async ngOnInit() {
    // Verifica si el enlace de verificación es válido
    const email = localStorage.getItem('emailForSignIn');
    if (email) {
      try {
        // Intenta iniciar sesión con el enlace de verificación
        const result = await this.afAuth.signInWithEmailLink(email, window.location.href);
        if (result.user) {
          // Si la verificación fue exitosa, puedes proceder con el registro
          this.showAlert('Registro completo', 'Tu cuenta ha sido verificada con éxito');
        }
      } catch (error) {
        // Si hubo un error con la verificación
        this.showAlert('Error', 'Hubo un problema con la verificación del correo electrónico');
      }
    } else {
      this.showAlert('Error', 'No se pudo verificar tu correo electrónico');
    }
  }

  // Función para mostrar alertas en la UI
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
