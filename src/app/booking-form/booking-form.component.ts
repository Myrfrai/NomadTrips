import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { getErrorKey, getErrorMessage } from '../core/api-error.util';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly tourId = input.required<number>();
  readonly tourPrice = input.required<number>();
  readonly tourName = input.required<string>();

  readonly loading = signal(false);
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );
  readonly success = signal('');
  readonly estimatedTotal = computed(() => this.travelers * this.tourPrice());
  readonly minDate = getTomorrowDate();

  fullName = '';
  phone = '';
  travelers = 1;
  travelDate = '';
  comment = '';

  constructor() {
    effect(() => {
      const currentUser = this.auth.user();
      if (currentUser && !this.fullName) {
        this.fullName = currentUser.name;
      }
    });
  }

  submitBooking(): void {
    if (this.loading()) {
      return;
    }

    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    const validationKey = this.validateBooking();
    if (validationKey) {
      this.errorKey.set(validationKey);
      return;
    }

    this.loading.set(true);

    this.toursService
      .createBooking({
        tourId: this.tourId(),
        fullName: this.fullName.trim(),
        phone: this.phone.trim(),
        travelers: this.travelers,
        travelDate: this.travelDate,
        comment: this.comment.trim()
      })
      .subscribe({
        next: () => {
          this.success.set(`${this.i18n.t('booking.success')} ${this.tourName()}.`);
          this.phone = '';
          this.travelers = 1;
          this.travelDate = '';
          this.comment = '';
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

  private validateBooking(): string {
    const trimmedName = this.fullName.trim();
    const trimmedPhone = this.phone.trim();
    const namePattern = /^[A-Za-zА-Яа-яЁёҚқҒғҮүҰұӨөІіӘә\s-]+$/;
    const phonePattern = /^\+?\d+$/;

    if (!trimmedName) {
      return 'booking.errors.nameRequired';
    }

    if (!namePattern.test(trimmedName)) {
      return 'booking.errors.nameLetters';
    }

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return 'booking.errors.nameLength';
    }

    if (!trimmedPhone) {
      return 'booking.errors.phoneRequired';
    }

    if (trimmedPhone.length < 2 || trimmedPhone.length > 18) {
      return 'booking.errors.phoneDigits';
    }

    if (!phonePattern.test(trimmedPhone) || (trimmedPhone.startsWith('+') && trimmedPhone.length === 1)) {
      return 'booking.errors.phoneDigits';
    }

    if (!Number.isFinite(this.travelers) || this.travelers < 1) {
      return 'booking.errors.travelersMin';
    }

    if (this.travelers > 50) {
      return 'booking.errors.travelersMax';
    }

    if (!this.travelDate) {
      return 'booking.errors.dateRequired';
    }

    if (this.travelDate < this.minDate) {
      return 'booking.errors.dateFuture';
    }

    if (this.comment.trim().length > 300) {
      return 'booking.errors.commentLength';
    }

    return '';
  }
}

function getTomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('T')[0];
}
