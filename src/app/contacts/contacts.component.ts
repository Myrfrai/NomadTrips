import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getErrorMessage } from '../core/api-error.util';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  name = '';
  email = '';
  topic = 'general';
  message = '';

  submitContactRequest(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.toursService
      .createContactRequest({
        name: this.name.trim(),
        email: this.email.trim(),
        topic: this.topic,
        message: this.message.trim()
      })
      .subscribe({
        next: (response) => {
          this.success.set(response.message || this.i18n.t('contacts.success'));
          this.name = '';
          this.email = '';
          this.topic = 'general';
          this.message = '';
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(getErrorMessage(error, 'Не удалось отправить сообщение.'));
          this.loading.set(false);
        }
      });
  }
}
