import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private http = inject(HttpClient);

  getRate(from: string, to: string) {
    return this.http.get<ExchangeRate>(`${environment.apiUrl}/currency/${from}/${to}`);
  }

  getAvailableCurrencies() {
    return this.http.get<any>(`${environment.apiUrl}/currency/rates`).pipe(
      map(res => {
        if (Array.isArray(res)) return res as string[];
        if (res?.currencies && Array.isArray(res.currencies)) return res.currencies as string[];
        if (res?.rates && typeof res.rates === 'object') return Object.keys(res.rates) as string[];
        return [] as string[];
      })
    );
  }
}
