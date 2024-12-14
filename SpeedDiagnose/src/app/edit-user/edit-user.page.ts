import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userId: string = '';
  user: any = {};

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario de la URL
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.loadUser();
    });
  }

  // Cargar los datos del usuario
  loadUser() {
    this.firestore.collection('users').doc(this.userId).get().subscribe(doc => {
      if (doc.exists) {
        this.user = doc.data();
      } else {
        this.showToast('Usuario no encontrado');
      }
    });
  }

  // Guardar los cambios en el usuario
  async saveUser() {
    if (!this.user) {
      this.showToast('No se han realizado cambios');
      return;
    }

    try {
      await this.firestore.collection('users').doc(this.userId).update({
        totalFat: this.user.totalFat,
        totalSodium: this.user.totalSodium,
        totalCarbs: this.user.totalCarbs,
      });
      this.showToast('Datos actualizados correctamente');
      this.router.navigate(['/admin']); // Redirigir a la página de administración
    } catch (error) {
      this.showToast('Error al actualizar los datos');
      console.error('Error actualizando los datos del usuario:', error);
    }
  }

  // Método para mostrar mensajes de toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
