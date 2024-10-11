import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  totalCalories: number = 0; // Calorías totales ingresadas

  desayuno: { name: string, calories: number }[] = [
    { name: 'Tostadas', calories: 150 },
    { name: 'Cereal', calories: 200 },
    { name: 'Jugo de naranja', calories: 120 },
    { name: 'Huevos', calories: 140 },
    { name: 'Avena', calories: 160 },
    { name: 'Frutas', calories: 100 },
    { name: 'Café', calories: 5 }
  ];
  almuerzo: { name: string, calories: number }[] = [
    { name: 'Pollo asado', calories: 300 },
    { name: 'Ensalada', calories: 150 },
    { name: 'Sopa de verduras', calories: 100 },
    { name: 'Carne al horno', calories: 350 },
    { name: 'Pasta', calories: 400 },
    { name: 'Arroz con pollo', calories: 350 },
    { name: 'Pizza', calories: 280 }
  ];
  once: { name: string, calories: number }[] = [
    { name: 'Sandwich', calories: 250 },
    { name: 'Té', calories: 30 },
    { name: 'Galletas', calories: 200 },
    { name: 'Empanadas', calories: 300 },
    { name: 'Jugos naturales', calories: 120 },
    { name: 'Pan con palta', calories: 180 },
    { name: 'Yogur', calories: 150 }
  ];
  otro: { name: string, calories: number }[] = [
    { name: 'Barra de proteínas', calories: 220 },
    { name: 'Frutos secos', calories: 180 },
    { name: 'Batido', calories: 250 },
    { name: 'Galletas de avena', calories: 200 },
    { name: 'Tostadas con miel', calories: 220 },
    { name: 'Fruta picada', calories: 150 },
    { name: 'Chocolates', calories: 300 }
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  getRandomMeals(meals: { name: string, calories: number }[]): { name: string, calories: number }[] {
    let shuffled = meals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Selecciona los primeros 3 elementos de la lista mezclada
  }

  async onSegmentChanged(event: any) {
    const value = event.detail.value;

    let selectedMeals: { name: string, calories: number }[];

    switch (value) {
      case 'Desayuno':
        selectedMeals = this.getRandomMeals(this.desayuno);
        break;
      case 'Almuerzo':
        selectedMeals = this.getRandomMeals(this.almuerzo);
        break;
      case 'Once':
        selectedMeals = this.getRandomMeals(this.once);
        break;
      case 'Otro':
        selectedMeals = this.getRandomMeals(this.otro);
        break;
      default:
        selectedMeals = [];
    }

    // Crear los botones para el action sheet
    const buttons = selectedMeals.map(meal => ({
      text: meal.name,
      handler: () => {
        this.totalCalories += meal.calories;
        this.navController.navigateForward(`/calorias/${encodeURIComponent(meal.name)}/${meal.calories}`);
      }
    }));

    // Agregar el botón de cancelar sin la propiedad `role`
    buttons.push({
      text: 'Cancelar',
      handler: () => {
        console.log('Cancelado');
      }
    });

    const actionSheet = await this.actionSheetController.create({
      header: `Opciones de ${value}`,
      buttons: buttons
    });
    await actionSheet.present();
  }

  async onSettingsClick() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      message: 'La sección de configuración está en desarrollo. ¡Vuelve más tarde!',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
}
