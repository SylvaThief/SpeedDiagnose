import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private apiUrl = 'https://api.api-ninjas.com/v1/nutrition';
  private apiKey = '6VPgdPqY6nnlFLLKb9uO2A==q3MDew6j0Qt2GpMu'; // Sustituye por tu API Key

  constructor(private http: HttpClient) {}

  // Método para buscar información nutricional
  searchFood(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey, // Incluye tu API Key en los headers
    });

    const url = `${this.apiUrl}?query=${query}`;
    return this.http.get(url, { headers });
  }
}
