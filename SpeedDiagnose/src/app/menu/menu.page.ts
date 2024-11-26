import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa Firebase Authentication

@Component({
  selector: 'app-menu', // Selector del componente
  templateUrl: './menu.page.html', // Archivo HTML asociado
  styleUrls: ['./menu.page.scss'], // Estilos CSS asociados
})
export class MenuPage {
  // Variables para almacenar el email y contraseña del usuario
  email: string = '';
  password: string = '';

  // Inyección de dependencias necesarias en el constructor
  constructor(
    private router: Router, // Para realizar navegación entre páginas
    private alertController: AlertController, // Para mostrar alertas en la interfaz
    private afAuth: AngularFireAuth // Servicio de Firebase Authentication
  ) {}

  /**
   * Método para iniciar sesión
   */
  async onLogin() {
    try {
      // Validar que el email y la contraseña no estén vacíos
      if (!this.email || !this.password) {
        throw new Error('Por favor, ingresa tu correo y contraseña.');
      }

      // Intenta iniciar sesión con el correo y contraseña ingresados
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);

      if (userCredential.user) {
        // Si el usuario existe, redirige a la página 'home'
        this.router.navigate(['/home']);
      }
    } catch (error) {
      // Manejo de errores específicos y generales
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
      // Validar que el email no esté vacío y tenga un formato válido
      if (!this.email || !this.email.includes('@')) {
        throw new Error('Por favor, ingresa un correo válido.');
      }

      // Configuración del código de acción para la verificación de correo
      const actionCodeSettings = {
        url: `${window.location.origin}/finish-signup`, // URL válida (ajusta según tu proyecto)
        handleCodeInApp: true, // Gestiona el enlace dentro de la aplicación
      };

      // Enviar el enlace de verificación al correo electrónico ingresado
      await this.afAuth.sendSignInLinkToEmail(this.email, actionCodeSettings);

      // Guarda el email localmente para usarlo más tarde al completar el registro
      localStorage.setItem('emailForSignIn', this.email);

      // Alerta de confirmación indicando que se envió el enlace
      const alert = await this.alertController.create({
        header: 'Verificación enviada',
        message: 'Te hemos enviado un código de verificación a tu correo electrónico.',
        buttons: ['OK']
      });
      await alert.present();

      // Navega a la página de finalización de registro
      this.router.navigate(['/finish-signup']);
    } catch (error) {
      // Manejo de errores específicos y generales
      const errorMessage = this.getErrorMessage(error);
      console.error('Error en onRegister:', errorMessage); // Mostrar detalles del error en la consola
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  /**
   * Método para extraer el mensaje de error de un objeto tipo `unknown`
   * @param error El error capturado
   * @returns El mensaje de error o un mensaje genérico
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // Si el error es una instancia de `Error`, devuelve su mensaje
      return error.message;
    }
    // Mensaje genérico si el error no tiene formato esperado
    return 'Ocurrió un error inesperado.';
  }
}
