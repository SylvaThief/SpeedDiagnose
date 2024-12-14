import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component'; // Componente de modal

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  users: any[] = []; // Lista de usuarios
  selectedUser: any = null; // Usuario seleccionado para editar

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController // ModalController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Cargar todos los usuarios desde Firestore
  async loadUsers() {
    try {
      const usersCollection = this.firestore.collection('users').snapshotChanges();
      usersCollection.subscribe(
        snapshot => {
          console.log('Usuarios recibidos:', snapshot); // Agregar log para ver los datos recibidos
          this.users = snapshot.map(doc => {
            const data = doc.payload.doc.data();
            const id = doc.payload.doc.id;
  
            // Verificar que 'data' es un objeto válido antes de hacer spread
            if (data && typeof data === 'object') {
              return { ...data, id };
            } else {
              console.error('Datos inválidos o nulos', data);
              return null;  // Filtrar los casos donde los datos no son válidos
            }
          }).filter(user => user !== null); // Filtrar los usuarios nulos
          console.log('Usuarios mapeados:', this.users); // Agregar log para verificar cómo se mapea la lista
        },
        error => {
          console.error('Error al cargar los usuarios:', error);
          this.showToast('Error al cargar los usuarios');
        }
      );
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      this.showToast('Error al cargar los usuarios');
    }
  }

  // Función para editar un usuario
  async editUser(user: any) {
    this.selectedUser = { ...user }; // Hacer una copia del usuario para edición
    const modal = await this.modalController.create({
      component: EditUserModalComponent, // Componente de modal
      componentProps: {
        user: this.selectedUser, // Pasar el usuario al modal
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Si el modal cerró con datos, actualizamos la lista de usuarios
        this.loadUsers();
      }
    });

    return await modal.present();
  }

  // Método para eliminar un usuario
  async deleteUser(user: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar a ${user.email}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.collection('users').doc(user.id).delete();
              this.showToast('Usuario eliminado');
              this.loadUsers(); // Recargar la lista de usuarios después de la eliminación
            } catch (error) {
              this.showToast('Error al eliminar el usuario');
              console.error('Error al eliminar el usuario:', error);
            }
          },
        },
      ],
    });

    await alert.present();
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

  // Método de logout
  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/menu']); // Redirigir al login
      this.showToast('Sesión cerrada');
    } catch (error) {
      this.showToast('Error al cerrar sesión');
      console.error('Error cerrando sesión:', error);
    }
  }
}
