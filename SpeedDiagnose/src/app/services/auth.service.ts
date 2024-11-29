import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';  // Importar funciones de Firebase v9+
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth();  // Inicializa el Auth de Firebase

  constructor() { }

  // Registra un nuevo usuario con correo y contraseña
  register(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          observer.next(userCredential);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error.message);  // En caso de error, devuelve el mensaje
        });
    });
  }

  // Inicia sesión con correo y contraseña
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          observer.next(userCredential);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error.message);  // En caso de error, devuelve el mensaje
        });
    });
  }

  // Cierra sesión del usuario actual
  logout(): Observable<any> {
    return new Observable(observer => {
      signOut(this.auth)
        .then(() => {
          observer.next('Sesión cerrada');
          observer.complete();
        })
        .catch((error) => {
          observer.error(error.message);
        });
    });
  }

  // Obtiene el usuario actual (si está logueado)
  getCurrentUser(): Observable<User | null> {
    return new Observable(observer => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);  // Devuelve el usuario o null si no está autenticado
      });
    });
  }
}
