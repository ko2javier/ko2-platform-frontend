import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type Lang = 'es' | 'en' | 'de';

@Component({
  selector: 'app-about-panel',
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-panel.component.html',
  styleUrl: './about-panel.component.scss'
})
export class AboutPanelComponent {
  @Input() isOpen = false;
  @Output() closePanel = new EventEmitter<void>();

  private translate = inject(TranslateService);

  readonly langs: Lang[] = ['es', 'en', 'de'];
  currentLang: Lang = 'es';

  get langIndex(): number { return this.langs.indexOf(this.currentLang); }

  ngOnInit() {
    this.currentLang = (this.translate.currentLang ?? 'es') as Lang;
    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang as Lang;
    });
  }

  setLang(lang: Lang) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  close() {
    this.closePanel.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
