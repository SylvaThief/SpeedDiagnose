import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges();
  }

  // Eliminar un usuario por ID
  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }

  // Actualizar un usuario por ID
  updateUser(userId: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(userData);
  }
}
