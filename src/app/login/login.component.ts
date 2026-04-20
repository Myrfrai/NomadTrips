import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { getErrorMessage } from '../core/api-error.util';
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
  readonly error = signal('');

  email = 'traveler@nomadtrips.kz';
  password = 'demo12345';

  submit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/profile';
        void this.router.navigateByUrl(redirectTo);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(getErrorMessage(error, 'Не удалось войти в аккаунт.'));
        this.loading.set(false);
      }
    });
  }
}
