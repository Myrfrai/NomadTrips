import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './auth.service';
import { AppLanguage } from './core/api.models';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  readonly currentYear = new Date().getFullYear();
  readonly currentUserName = computed(() => this.auth.user()?.name.split(' ')[0] ?? '');

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.i18n.setLanguage(target.value as AppLanguage);
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
