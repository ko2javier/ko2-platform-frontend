import { Component } from '@angular/core';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { CurrencyWidgetComponent } from '../../components/currency-widget/currency-widget.component';

@Component({
  selector: 'app-dashboard',
  imports: [WeatherWidgetComponent, CurrencyWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
