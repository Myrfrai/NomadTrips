import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { getErrorKey, getErrorMessage } from '../core/api-error.util';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );
  readonly mode = signal<'login' | 'register'>('login');

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  toggleMode(nextMode: 'login' | 'register'): void {
    this.mode.set(nextMode);
    this.errorKey.set('');
    this.errorText.set('');
  }

  submit(): void {
    this.loading.set(true);
    this.errorKey.set('');
    this.errorText.set('');

    if (this.mode() === 'register') {
      if (this.password !== this.confirmPassword) {
        this.errorText.set('Пароли не совпадают.');
        this.loading.set(false);
        return;
      }

      this.auth.register({ name: this.name.trim(), email: this.email, password: this.password }).subscribe({
        next: () => {
          const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/profile';
          void this.router.navigateByUrl(redirectTo);
          this.loading.set(false);
        },
        error: (error) => {
          const key = getErrorKey(error);
          if (key) {
            this.errorKey.set(key);
          } else {
            this.errorText.set(getErrorMessage(error, this.i18n.t('errors.generic')));
          }
          this.loading.set(false);
        }
      });
      return;
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/profile';
        void this.router.navigateByUrl(redirectTo);
        this.loading.set(false);
      },
      error: (error) => {
        const key = getErrorKey(error);
        if (key) {
          this.errorKey.set(key);
        } else {
          this.errorText.set(getErrorMessage(error, this.i18n.t('errors.generic')));
        }
        this.loading.set(false);
      }
    });
  }
}
