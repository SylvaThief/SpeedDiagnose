import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa Firebase Authentication
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa Firestore

@Component({
  selector: 'app-menu', // Selector del componente
  templateUrl: './menu.page.html', // Archivo HTML asociado
  styleUrls: ['./menu.page.scss'], // Estilos CSS asociados
})
export class MenuPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private afAuth: AngularFireAuth, // Servicio de Firebase Authentication
    private firestore: AngularFirestore // Servicio de Firestore
  ) {}

  /**
   * Método para iniciar sesión
   */
  async onLogin(email: string, password: string) {
    try {
      // Validar que el email y la contraseña no estén vacíos
      if (!this.email || !this.password) {
        throw new Error('Por favor, ingresa tu correo y contraseña.');
      }

      // Iniciar sesión con el correo y contraseña
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);

      if (userCredential.user) {
        // Crear documento en Firestore si no existe
        const userDoc = this.firestore.collection('users').doc(userCredential.user.uid);
        const userSnapshot = await userDoc.get().toPromise();

        // Verificar si el documento existe y si no está indefinido
        if (userSnapshot && userSnapshot.exists) {
          const userData = userSnapshot.data();

          // Si faltan campos, los agregamos
          const missingFields = this.checkMissingFields(userData);

          if (Object.keys(missingFields).length > 0) {
            // Actualizar solo los campos faltantes
            await userDoc.update(missingFields);
          }
        } else {
          // Si el documento no existe, lo creamos con los valores iniciales
          await userDoc.set({
            email: this.email,
            isAdmin: false, // Asumir que no es admin por defecto
            totalFat: 0,    // Valor inicial de totalFat
            totalSodium: 0, // Valor inicial de totalSodium
            totalCarbs: 0,  // Valor inicial de totalCarbs
          });
        }

        // Redirigir al usuario a la página 'home'
        this.router.navigate(['/home']);
      }
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  /**
   * Método para registrar al usuario y enviar un enlace de verificación por correo
   */
  async onRegister() {
    try {
      if (!this.email || !this.email.includes('@')) {
        throw new Error('Por favor, ingresa un correo válido.');
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/finish-signup`,
        handleCodeInApp: true,
      };

      await this.afAuth.sendSignInLinkToEmail(this.email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', this.email);

      const alert = await this.alertController.create({
        header: 'Verificación enviada',
        message: 'Te hemos enviado un código de verificación a tu correo electrónico.',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/finish-signup']);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('Error en onRegister:', errorMessage);
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  /**
   * Verifica si faltan campos en los datos del usuario
   */
  checkMissingFields(userData: any): any {
    const missingFields: any = {};

    // Comprobamos si los campos faltan o son nulos
    if (userData && (userData.totalFat === undefined || userData.totalFat === null)) {
      missingFields.totalFat = 0;
    }

    if (userData && (userData.totalSodium === undefined || userData.totalSodium === null)) {
      missingFields.totalSodium = 0;
    }

    if (userData && (userData.totalCarbs === undefined || userData.totalCarbs === null)) {
      missingFields.totalCarbs = 0;
    }

    return missingFields;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Ocurrió un error inesperado.';
  }
}
