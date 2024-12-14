import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-app-food-api',
  templateUrl: './app-food-api.page.html',
  styleUrls: ['./app-food-api.page.scss'],
})
export class AppFoodApiPage implements OnInit {

  apiUrl = 'https://api.api-ninjas.com/v1/nutrition';
  apiKey = '6VPgdPqY6nnlFLLKb9uO2A==q3MDew6j0Qt2GpMu';
  
  foodList = [
    'apple', 'banana', 'oats', 'eggs', 'chicken', 'rice', 'salad', 'beef', 
    'toast', 'butter', 'cheese', 'tea', 'carrot', 'broccoli', 'potato', 
    'cucumber', 'spinach', 'avocado', 'strawberry', 'watermelon', 'pineapple', 
    'mango', 'grapes', 'peach', 'pear', 'melon', 'tomato', 'lettuce', 'cabbage', 'onion'
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  // Método para hacer las solicitudes de la lista de alimentos
  async checkFoodData() {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });

    for (const food of this.foodList) {
      try {
        const response: any = await firstValueFrom(
          this.http.get(`${this.apiUrl}?query=${food}`, { headers })
        );

        // Imprimir en consola si hay resultados o no
        if (response && response.length > 0) {
          console.log('Sí');
        } else {
          console.log('No');
        }
      } catch (error) {
        console.log('No');
        console.error('Error al consultar la API para', food, error);
      }
    }
  }

}

