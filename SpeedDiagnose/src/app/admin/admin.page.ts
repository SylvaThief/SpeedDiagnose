import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
})
export class AdminPage {
  users: any[] = []; // Lista de usuarios
  loading: boolean = true; // Indicador de carga
  currentUser: any = null; // Usuario actual para verificar su rol

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loadUsers(); // Cargar los usuarios al iniciar
  }

  // Cargar los usuarios desde Firestore
  async loadUsers() {
    try {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          // Si el usuario está autenticado, cargar todos los usuarios
          this.loadAllUsers();
        } else {
          this.showToast('No estás autenticado');
          this.router.navigate(['/login']); // Redirigir si no está autenticado
        }
      });
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      this.loading = false;
      this.showToast('Error al cargar los usuarios');
    }
  }

  // Cargar todos los usuarios
  async loadAllUsers() {
    try {
      console.log('Cargando usuarios desde Firestore...');

      const usersSnapshot = await this.firestore.collection('users').get().toPromise();

      if (usersSnapshot && !usersSnapshot.empty) {
        console.log('Snapshot de usuarios:', usersSnapshot);

        // Verificar que cada documento tiene datos válidos antes de usar el spread operator
        this.users = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          if (data && typeof data === 'object') {
            return { id: doc.id, ...data }; // Solo si los datos son un objeto
          }
          return null; // Si no son válidos, devolver null
        }).filter(user => user !== null); // Filtrar los elementos nulos

        console.log('Usuarios cargados:', this.users);
      } else {
        console.log('No se encontraron usuarios en la colección.');
        this.users = [];
      }

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      this.loading = false;
      this.showToast('Error al cargar los usuarios');
    }
  }

  // Mostrar un toast con el mensaje proporcionado
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  // Editar los datos del usuario
  async editUser(user: any) {
    const alert = await this.alertController.create({
      header: 'Editar usuario',
      inputs: [
        {
          name: 'email',
          type: 'text',
          value: user.email || '',
          placeholder: 'Email',
          disabled: true,
        },
        {
          name: 'isAdmin',
          type: 'checkbox',
          label: 'Administrador',
          checked: user.isAdmin || false,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (formData) => {
            await this.updateUser(user.id, formData.isAdmin);
          },
        },
      ],
    });

    await alert.present();
  }

  // Actualizar los datos del usuario en Firestore
  async updateUser(userId: string, isAdmin: boolean) {
    try {
      if (!userId) {
        console.log('ID de usuario no válido');
        return;
      }

      await this.firestore.collection('users').doc(userId).update({
        isAdmin: isAdmin,
      });
      this.showToast('Usuario actualizado correctamente');
      this.loadUsers(); // Recargar los usuarios para ver los cambios
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      this.showToast('Error al actualizar el usuario');
    }
  }

  // Eliminar un usuario
  async deleteUser(userId: string) {
    try {
      if (!userId) {
        console.log('ID de usuario no válido');
        return;
      }

      // Eliminar el usuario de Firestore
      await this.firestore.collection('users').doc(userId).delete();
      this.showToast('Usuario eliminado correctamente');
      this.loadUsers(); // Recargar los usuarios para ver los cambios
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      this.showToast('Error al eliminar el usuario');
    }
  }

  // Cerrar sesión (logout)
  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
      this.showToast('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.showToast('Error al cerrar sesión');
    }
  }
}
