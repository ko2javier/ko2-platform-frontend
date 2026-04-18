import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface WeatherData {
  latitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
  };
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);

  getWeather(city: string = 'santander') {
    return this.http.get<WeatherData>(`${environment.apiUrl}/weather/${city}`);
  }
}
