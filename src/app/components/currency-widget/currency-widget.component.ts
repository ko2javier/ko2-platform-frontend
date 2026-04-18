import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyService, ExchangeRate } from '../../services/currency.service';

const FALLBACK_CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'HKD', 'NOK', 'SEK', 'DKK', 'NZD', 'SGD', 'MXN'];

const MOCK_VARIATIONS: Record<string, number> = {
  'EUR-USD': 0.15, 'EUR-GBP': -0.08, 'USD-EUR': -0.12,
  'EUR-JPY': 0.42, 'EUR-CHF': -0.05, 'USD-GBP': 0.10,
};

@Component({
  selector: 'app-currency-widget',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './currency-widget.component.html',
  styleUrl: './currency-widget.component.scss'
})
export class CurrencyWidgetComponent implements OnInit {
  private currencyService = inject(CurrencyService);

  // Available currencies
  allCurrencies: string[] = [];
  currenciesLoading = true;

  // Dropdown state
  showFromDropdown = false;
  showToDropdown = false;
  fromSearch = '';
  toSearch = '';

  selectedFrom = 'EUR';
  selectedTo = 'USD';
  amount = 100;

  currentRate: ExchangeRate | null = null;
  loading = true;
  error = false;
  private lastUpdated: Date | null = null;

  ngOnInit() {
    this.currencyService.getAvailableCurrencies().subscribe({
      next: (currencies) => {
        this.allCurrencies = currencies.length > 0 ? currencies : FALLBACK_CURRENCIES;
        this.currenciesLoading = false;
      },
      error: () => {
        this.allCurrencies = FALLBACK_CURRENCIES;
        this.currenciesLoading = false;
      }
    });
    this.loadRate();
  }

  // ── Filtering ──────────────────────────────────────────────
  get filteredFrom(): string[] {
    const q = this.fromSearch.toLowerCase();
    return this.allCurrencies.filter(c => c !== this.selectedTo && c.toLowerCase().includes(q));
  }

  get filteredTo(): string[] {
    const q = this.toSearch.toLowerCase();
    return this.allCurrencies.filter(c => c !== this.selectedFrom && c.toLowerCase().includes(q));
  }

  // ── Dropdown controls ──────────────────────────────────────
  toggleFromDropdown() {
    this.showFromDropdown = !this.showFromDropdown;
    this.showToDropdown = false;
    this.fromSearch = '';
  }

  toggleToDropdown() {
    this.showToDropdown = !this.showToDropdown;
    this.showFromDropdown = false;
    this.toSearch = '';
  }

  selectFrom(c: string) {
    this.selectedFrom = c;
    this.showFromDropdown = false;
    this.fromSearch = '';
    this.loadRate();
  }

  selectTo(c: string) {
    this.selectedTo = c;
    this.showToDropdown = false;
    this.toSearch = '';
    this.loadRate();
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showFromDropdown = false;
    this.showToDropdown = false;
  }

  // ── Rate loading ───────────────────────────────────────────
  loadRate() {
    if (this.selectedFrom === this.selectedTo) return;
    this.loading = true;
    this.error = false;
    this.currentRate = null;
    this.currencyService.getRate(this.selectedFrom, this.selectedTo).subscribe({
      next: (r) => { this.currentRate = r; this.loading = false; this.lastUpdated = new Date(); },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  // ── Computed ───────────────────────────────────────────────
  get convertedAmount(): number {
    return this.currentRate ? this.amount * this.currentRate.rate : 0;
  }

  get minutesAgo(): number {
    if (!this.lastUpdated) return 0;
    return Math.floor((Date.now() - this.lastUpdated.getTime()) / 60000);
  }

  get variation(): number {
    if (!this.currentRate) return 0;
    return MOCK_VARIATIONS[`${this.currentRate.from}-${this.currentRate.to}`] ?? 0.05;
  }
}
