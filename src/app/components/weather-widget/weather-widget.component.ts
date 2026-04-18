import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { WeatherService, WeatherData } from '../../services/weather.service';

const HISTORY_KEY = 'weather_city_history';

@Component({
  selector: 'app-weather-widget',
  imports: [CommonModule, TranslateModule],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.scss'
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  private weatherService = inject(WeatherService);

  city = 'Santander';
  data: WeatherData | null = null;
  loading = true;
  errorType: 'not-found' | 'network' | null = null;
  cityHistory: string[] = [];

  private search$ = new Subject<string>();
  private sub?: Subscription;

  ngOnInit() {
    this.cityHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');

    this.sub = this.search$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(cityName => {
        this.loading = true;
        this.data = null;
        this.errorType = null;
        return this.weatherService.getWeather(cityName).pipe(
          catchError((err: HttpErrorResponse) => {
            this.loading = false;
            this.data = null;
            this.errorType = err.status === 404 ? 'not-found' : 'network';
            return EMPTY;
          })
        );
      })
    ).subscribe(res => {
      this.data = res;
      this.loading = false;
      this.saveToHistory(this.city);
    });

    this.search$.next('santander');
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value === '') {
      this.city = 'Santander';
      this.search$.next('santander');
    } else if (value.length >= 2) {
      this.city = value;
      this.search$.next(value);
    }
  }

  selectCity(city: string) {
    this.city = city;
    this.search$.next(city.toLowerCase());
  }

  private saveToHistory(city: string) {
    const label = city.charAt(0).toUpperCase() + city.slice(1);
    this.cityHistory = [
      label,
      ...this.cityHistory.filter(c => c.toLowerCase() !== city.toLowerCase())
    ].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(this.cityHistory));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get weatherDescription(): string {
    const temp = this.data?.current_weather.temperature ?? 15;
    const ws = this.data?.current_weather.windspeed ?? 0;
    if (temp > 28) return 'Caluroso';
    if (temp > 20) return 'Templado';
    if (ws > 50) return 'Temporal';
    if (ws > 30) return 'Ventoso';
    if (temp > 10) return 'Fresco';
    return 'Nublado';
  }

  get sparkBars(): number[] {
    const t = this.data?.current_weather.temperature ?? 15;
    return [-4, -2, 0, 2, 3, 3, 1, -1].map(o => t + o);
  }

  private get sparkMin(): number { return Math.min(...this.sparkBars); }
  private get sparkMax(): number { return Math.max(...this.sparkBars); }

  sparkHeight(val: number): number {
    const range = this.sparkMax - this.sparkMin || 1;
    return Math.round(((val - this.sparkMin) / range) * 44) + 6;
  }
}
