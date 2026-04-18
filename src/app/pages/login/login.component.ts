import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

type Lang = 'es' | 'en' | 'de';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  isDark = true;
  currentLang: Lang = 'es';
  readonly langs: Lang[] = ['es', 'en', 'de'];

  get langIndex(): number { return this.langs.indexOf(this.currentLang); }

  private auth = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

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

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'LOGIN.ERROR';
        this.loading = false;
      }
    });
  }
}
