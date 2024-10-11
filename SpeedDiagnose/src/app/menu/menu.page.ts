import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async onLogin() {
    // Simple validación de usuario y contraseña
    if (this.username === 'admin' && this.password === '1234') {
      // Redirigir al usuario si las credenciales son correctas
      this.router.navigate(['/home']);
    } else {
      // Mostrar un mensaje de error si las credenciales son incorrectas
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
