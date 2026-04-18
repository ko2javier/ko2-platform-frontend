import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AboutPanelComponent } from '../about-panel/about-panel.component';

const LANGS = ['es', 'en', 'de'] as const;
type Lang = typeof LANGS[number];

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, AboutPanelComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

  isDark = true;
  currentLang: Lang = 'es';
  readonly langs = LANGS;
  showAbout = false;

  get langIndex(): number { return this.langs.indexOf(this.currentLang); }
  get username(): string  { return this.auth.getUsername(); }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDark = false;
      document.body.classList.add('light-mode');
    }
    const savedLang = (localStorage.getItem('lang') ?? 'es') as Lang;
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('light-mode', !this.isDark);
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  setLang(lang: Lang) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  logout() {
    this.auth.logout();
  }
}
