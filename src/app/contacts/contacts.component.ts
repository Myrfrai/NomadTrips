import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getErrorKey, getErrorMessage } from '../core/api-error.util';
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
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );
  readonly success = signal('');

  name = '';
  email = '';
  topic = 'general';
  message = '';

  submitContactRequest(): void {
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    const validationKey = this.validateContact();
    if (validationKey) {
      this.errorKey.set(validationKey);
      return;
    }

    this.loading.set(true);

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

  private validateContact(): string {
    const trimmedName = this.name.trim();
    const trimmedEmail = this.email.trim();
    const trimmedMessage = this.message.trim();
    const namePattern = /^[A-Za-zА-Яа-яЁёҚқҒғҮүҰұӨөІіӘә\s-]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      return 'contacts.errors.nameRequired';
    }

    if (!namePattern.test(trimmedName)) {
      return 'contacts.errors.nameLetters';
    }

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return 'contacts.errors.nameLength';
    }

    if (!trimmedEmail) {
      return 'contacts.errors.emailRequired';
    }

    if (!emailPattern.test(trimmedEmail)) {
      return 'contacts.errors.emailInvalid';
    }

    if (!trimmedMessage) {
      return 'contacts.errors.messageRequired';
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 300) {
      return 'contacts.errors.messageLength';
    }

    return '';
  }
}
