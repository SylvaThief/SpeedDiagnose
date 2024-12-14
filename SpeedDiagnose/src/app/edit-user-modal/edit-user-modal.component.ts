import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent {
  @Input() user: any; // Recibir el usuario desde el componente padre

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore // Inyectar AngularFirestore
  ) {}

  // Cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

  // Guardar los cambios en el usuario
  async saveChanges() {
    try {
      if (this.user && this.user.id) {
        // Actualizar el usuario en Firestore
        await this.firestore.collection('users').doc(this.user.id).update({
          totalFat: this.user.totalFat,
          totalSodium: this.user.totalSodium,
          totalCarbs: this.user.totalCarbs,
        });
        console.log('Usuario actualizado:', this.user); // Log para verificar que el usuario se actualizó
        this.modalController.dismiss(this.user); // Enviar el usuario actualizado al componente padre
      } else {
        console.error('No se ha proporcionado un usuario válido');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }
}
