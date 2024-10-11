import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Definir listas de comidas
  desayuno: string[] = ['Tostadas', 'Cereal', 'Jugo de naranja', 'Huevos', 'Avena', 'Frutas', 'Café'];
  almuerzo: string[] = ['Pollo asado', 'Ensalada', 'Sopa de verduras', 'Carne al horno', 'Pasta', 'Arroz con pollo', 'Pizza'];
  once: string[] = ['Sandwich', 'Té', 'Galletas', 'Empanadas', 'Jugos naturales', 'Pan con palta', 'Yogur'];
  otro: string[] = ['Barra de proteínas', 'Frutos secos', 'Batido', 'Galletas de avena', 'Tostadas con miel', 'Fruta picada', 'Chocolates'];

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  // Función para elegir 3 comidas aleatorias de una lista
  getRandomMeals(meals: string[]): string[] {
    let shuffled = meals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Selecciona los primeros 3 elementos de la lista mezclada
  }

  // Evento al cambiar el segmento
  async onSegmentChanged(event: any) {
    const value = event.detail.value;

    let selectedMeals: string[];

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
      text: meal,
      handler: () => {
        console.log(`${meal} seleccionado`);
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

  // Evento al hacer clic en el botón de configuración
  async onSettingsClick() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      message: 'La sección de configuración está en desarrollo. ¡Vuelve más tarde!',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
}
