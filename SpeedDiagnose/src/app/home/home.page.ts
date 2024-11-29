import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private navController: NavController,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  // Método para realizar la consulta a la API
  async searchFood(query: string) {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });

    try {
      console.log(`Buscando alimento: ${query}`);
      const response: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}?query=${query}`, { headers })
      );

      if (!response || response.length === 0) {
        console.log(`No se encontraron resultados para: ${query}`);
        return [];
      }

      // Filtrar los alimentos que contienen la información nutricional relevante
      const filteredFoods = response.filter((food: any) => {
        return food.fat_total_g && food.sodium_mg && food.carbohydrates_total_g;
      });

      if (filteredFoods.length === 0) {
        console.log(`No se encontraron alimentos válidos para: ${query}`);
      }

      // Traducir el nombre del alimento
      const translatedFoods = filteredFoods.map((food: any) => {
        const translatedName = this.foodTranslationMap[food.name.toLowerCase() as keyof typeof this.foodTranslationMap] || food.name;
        return { 
          ...food,
          translatedName: translatedName
        };
      });

      return translatedFoods;

    } catch (error) {
      console.error('Error al buscar alimentos:', error);
      return [];
    }
  }

  // Método para gestionar el cambio de segmento (categorías)
  async onSegmentChanged(event: any) {
    const value = event.detail.value;

    // Lista extendida de alimentos (30 alimentos)
    const foodQueries = [
      'apple', 'banana', 'oats', 'eggs', 'chicken', 'rice', 'salad', 'beef', 'toast', 'butter', 'cheese', 'tea', 'carrot', 'broccoli', 'potato', 'cucumber',
      'spinach', 'avocado', 'strawberry', 'watermelon', 'pineapple', 'mango', 'grapes', 'peach', 'pear', 'melon', 'tomato', 'lettuce', 'cabbage', 'onion'
    ];

    const foods: any[] = [];

    let missingQueries = [...foodQueries]; // Mantener lista de consultas faltantes
    let foundFoods = new Set(); // Usamos un Set para asegurarnos de que los alimentos sean distintos

    console.log(`Consultando para: ${foodQueries.join(', ')}`);

    // Consultar aleatoriamente hasta encontrar 4 alimentos distintos
    while (foundFoods.size < 4 && missingQueries.length > 0) {
      const randomIndex = Math.floor(Math.random() * missingQueries.length);
      const query = missingQueries.splice(randomIndex, 1)[0]; // Eliminar el alimento de la lista

      const foodData = await this.searchFood(query);
      if (foodData && foodData.length > 0) {
        foodData.forEach((food: any) => {
          foundFoods.add(food.translatedName); // Añadir el nombre traducido para evitar duplicados
          foods.push(food);
        });
      } else {
        console.log(`No se encontraron resultados para: ${query}`);
      }
    }

    if (foundFoods.size < 4) {
      console.log('No se encontraron suficientes alimentos distintos.');
    }

    // Crear botones con los alimentos encontrados
    const buttons = foods.slice(0, 4).map((food: any) => ({
      text: `${food.translatedName} (Grasa: ${food.fat_total_g}g, Sodio: ${food.sodium_mg}mg, Carbohidratos: ${food.carbohydrates_total_g}g)`,
      handler: () => {
        this.totalFat += food.fat_total_g;
        this.totalSodium += food.sodium_mg;
        this.totalCarbs += food.carbohydrates_total_g;

        // Guardar los datos nutricionales en Firestore
        this.saveFoodDataToFirestore(food);
        this.navController.navigateForward(`/nutricion-general`);
      },
    }));

    const actionSheet = await this.actionSheetController.create({
      header: `Selecciona tu opción para ${value}`,
      buttons,
    });

    await actionSheet.present();
  }

  // Método para guardar los datos nutricionales en Firestore
  async saveFoodDataToFirestore(food: any) {
    const user = await this.auth.currentUser;  // Obtener el usuario autenticado
    if (!user) {
      this.showToast('No estás autenticado');
      return;
    }

    const userId = user.uid;
    const foodItem = {
      name: food.translatedName,
      fat: food.fat_total_g,
      sodium: food.sodium_mg,
      carbs: food.carbohydrates_total_g,
      timestamp: new Date(),
    };

    try {
      await this.firestore.collection(`users/${userId}/food_items`).add(foodItem);
      this.showToast('Datos nutricionales guardados');
    } catch (error) {
      this.showToast('Error al guardar los datos');
      console.error('Error saving food data to Firestore:', error);
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
