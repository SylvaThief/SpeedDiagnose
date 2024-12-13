import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Agregar Router para redirigir

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  totalFat: number = 0;
  totalSodium: number = 0;
  totalCarbs: number = 0;

  apiUrl = 'https://api.api-ninjas.com/v1/nutrition';
  apiKey = '6VPgdPqY6nnlFLLKb9uO2A==q3MDew6j0Qt2GpMu';

  foodTranslationMap = {
    apple: 'Manzana',
    banana: 'Plátano',
    oats: 'Avena',
    eggs: 'Huevos',
    chicken: 'Pollo',
    rice: 'Arroz',
    salad: 'Ensalada',
    beef: 'Carne de res',
    toast: 'Tostada',
    butter: 'Mantequilla',
    cheese: 'Queso',
    tea: 'Té',
    carrot: 'Zanahoria',
    broccoli: 'Brócoli',
    potato: 'Papas',
    cucumber: 'Pepino',
    spinach: 'Espinaca',
    avocado: 'Aguacate',
    strawberry: 'Fresa',
    watermelon: 'Sandía',
    pineapple: 'Piña',
    mango: 'Mango',
    grapes: 'Uvas',
    peach: 'Durazno',
    pear: 'Pera',
    melon: 'Melón',
    tomato: 'Tomate',
    lettuce: 'Lechuga',
    cabbage: 'Repollo',
    onion: 'Cebolla',
  };

  isAdmin: boolean = false; // Flag para verificar si el usuario es administrador
  darkModeEnabled: boolean = false; // Estado del modo nocturno

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private navController: NavController,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private router: Router // Asegúrate de importar Router
  ) {
    this.loadUserData();
    this.loadTheme(); // Cargar el tema guardado
  }

  // Cargar datos del usuario
  async loadUserData() {
    const user = await this.auth.currentUser;
    if (user) {
      const userDoc = this.firestore.collection('users').doc(user.uid); // Cambiar a la colección 'users'
      const userSnapshot = await userDoc.get().toPromise();

      if (userSnapshot?.exists) {
        const data: any = userSnapshot.data();
        this.isAdmin = data.isAdmin || false; // Verificar si el usuario es administrador

        // Verificar si existen los campos de nutrición y asignar un valor por defecto de 0 si no existen
        this.totalFat = data.totalFat ?? 0;
        this.totalSodium = data.totalSodium ?? 0;
        this.totalCarbs = data.totalCarbs ?? 0;
      } else {
        // Crear documento inicial si no existe
        await userDoc.set({
          UID: user.uid,
          email: user.email,
          isAdmin: false, // Configuración por defecto
          totalFat: 0,    // Valor inicial de totalFat
          totalSodium: 0, // Valor inicial de totalSodium
          totalCarbs: 0,  // Valor inicial de totalCarbs
        });
      }
    }
  }

  // Método para realizar la consulta a la API
  async searchFood(query: string) {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });

    try {
      const response: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}?query=${query}`, { headers })
      );

      if (!response || response.length === 0) {
        return [];
      }

      // Filtrar los alimentos que contienen la información nutricional relevante
      const filteredFoods = response.filter((food: any) => {
        return food.fat_total_g && food.sodium_mg && food.carbohydrates_total_g;
      });

      // Traducir el nombre del alimento y redondear valores numéricos a 2 decimales
      return filteredFoods.map((food: any) => {
        const translatedName = this.foodTranslationMap[food.name.toLowerCase() as keyof typeof this.foodTranslationMap] || food.name;

        return { 
          ...food,
          fat_total_g: parseFloat(food.fat_total_g.toFixed(2)), // Redondear grasa total
          sodium_mg: parseFloat(food.sodium_mg.toFixed(2)), // Redondear sodio
          carbohydrates_total_g: parseFloat(food.carbohydrates_total_g.toFixed(2)), // Redondear carbohidratos
          translatedName: translatedName,
        };
      });
    } catch (error) {
      console.error('Error al buscar alimentos:', error);
      return [];
    }
  }

  // Método para gestionar el cambio de segmento (categorías)
  async onSegmentChanged(event: any) {
    const value = event.detail.value;

    const foodQueries = Object.keys(this.foodTranslationMap);
    const foods: any[] = [];

    let missingQueries = [...foodQueries];
    let foundFoods = new Set();

    while (foundFoods.size < 4 && missingQueries.length > 0) {
      const randomIndex = Math.floor(Math.random() * missingQueries.length);
      const query = missingQueries.splice(randomIndex, 1)[0];

      const foodData = await this.searchFood(query);
      if (foodData && foodData.length > 0) {
        foodData.forEach((food: any) => {
          foundFoods.add(food.translatedName);
          foods.push(food);
        });
      }
    }

    const buttons = foods.slice(0, 4).map((food: any) => ({
      text: `${food.translatedName} (Grasa: ${food.fat_total_g}g, Sodio: ${food.sodium_mg}mg, Carbohidratos: ${food.carbohydrates_total_g}g)`,
      handler: () => {
        // Realizar la suma y redondear a 2 decimales
        this.totalFat = parseFloat((this.totalFat + food.fat_total_g).toFixed(2));
        this.totalSodium = parseFloat((this.totalSodium + food.sodium_mg).toFixed(2));
        this.totalCarbs = parseFloat((this.totalCarbs + food.carbohydrates_total_g).toFixed(2));

        this.updateFoodData();  // Esta función ahora actualiza los datos en 'users'
        this.navController.navigateForward(`/nutricion-general`);
      },
    }));

    const actionSheet = await this.actionSheetController.create({
      header: `Selecciona tu opción para ${value}`,
      buttons,
    });

    await actionSheet.present();
  }

  // Método para actualizar los datos del usuario en Firestore
  async updateFoodData() {
    const user = await this.auth.currentUser;
    if (!user) {
      this.showToast('No estás autenticado');
      return;
    }

    try {
      // Redondear nuevamente antes de guardar en la base de datos
      this.totalFat = parseFloat(this.totalFat.toFixed(2));
      this.totalSodium = parseFloat(this.totalSodium.toFixed(2));
      this.totalCarbs = parseFloat(this.totalCarbs.toFixed(2));

      await this.firestore.collection('users').doc(user.uid).update({ // Cambiar a la colección 'users'
        totalFat: this.totalFat,
        totalSodium: this.totalSodium,
        totalCarbs: this.totalCarbs,
      });
      this.showToast('Datos actualizados correctamente');
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

  // Función para activar/desactivar el modo nocturno
  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    localStorage.setItem('darkMode', JSON.stringify(this.darkModeEnabled));

    // Aplicar el modo nocturno al body
    document.body.classList.toggle('dark', this.darkModeEnabled);
  }

  // Cargar el tema guardado
  loadTheme() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      this.darkModeEnabled = JSON.parse(darkMode);
      document.body.classList.toggle('dark', this.darkModeEnabled);
    }
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
