import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private auth: AngularFireAuth
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUserAuthentication();
      this.loadTheme(); // Asegurarse de cargar el tema al inicio
    });
  }

  // Verificar si el usuario está autenticado
  checkUserAuthentication() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  // Cargar el tema guardado en el almacenamiento local
  loadTheme() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      const darkModeEnabled = JSON.parse(darkMode);
      if (darkModeEnabled) {
        document.body.classList.add('dark');
      }
    }
  }
}
