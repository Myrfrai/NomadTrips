import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppLanguage, I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly i18n = inject(I18nService);
  protected readonly title = signal('nomadtrips');

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.i18n.setLanguage(target.value as AppLanguage);
  }
}
