import { Component } from '@angular/core';
import { Firestore, collection, doc, getDocs, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  public users: any[] = [];

  // Para almacenar los datos que se editarán
  editedData: any = {
    email: '',
    isAdmin: false,
    totalFat: 0,
    totalSodium: 0,
    totalCarbs: 0
  };

  constructor(private firestore: Firestore) {}

  // Cargar los usuarios desde la subcolección 'users'
  async ngOnInit() {
    const querySnapshot = await getDocs(collection(this.firestore, 'coleccionPrincipal', 'users'));
    querySnapshot.forEach((doc) => {
      this.users.push({ id: doc.id, ...doc.data() });
    });
  }

  // Editar un documento de usuario
  async editUser(userId: string, data: any) {
    // Asignamos los valores del documento para editar
    this.editedData = { ...data };

    // Crear un formulario o modal para editar (puedes hacer esto usando un modal o un formulario).
    // Aquí se puede agregar lógica para mostrar un formulario con estos valores y luego hacer un `updateDoc` después de editar.

    const userRef = doc(this.firestore, 'coleccionPrincipal', 'users', userId);
    await updateDoc(userRef, {
      email: this.editedData.email,
      isAdmin: this.editedData.isAdmin,
      totalFat: this.editedData.totalFat,
      totalSodium: this.editedData.totalSodium,
      totalCarbs: this.editedData.totalCarbs,
    });
    console.log('Documento de usuario actualizado');
  }

  // Eliminar un documento de usuario
  async deleteUser(userId: string) {
    const userRef = doc(this.firestore, 'coleccionPrincipal', 'users', userId);
    await deleteDoc(userRef);
    console.log('Documento de usuario eliminado');
    // Volver a cargar los usuarios para reflejar los cambios
    this.ngOnInit();
  }
}
