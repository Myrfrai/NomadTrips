import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { getErrorMessage } from '../core/api-error.util';
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
  readonly error = signal('');
  readonly success = signal('');
  readonly estimatedTotal = computed(() => this.travelers * this.tourPrice());

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

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

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
          this.error.set(getErrorMessage(error, 'Не удалось отправить бронь.'));
          this.loading.set(false);
        }
      });
  }
}
