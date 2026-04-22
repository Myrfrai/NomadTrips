import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { getErrorKey, getErrorMessage } from '../core/api-error.util';
import { Booking } from '../core/api.models';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );
  readonly success = signal('');
  readonly activeBookingId = signal<number | null>(null);

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.loading.set(true);
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    this.auth
      .loadProfile()
      .pipe(catchError(() => of(this.auth.user())))
      .subscribe();

    this.toursService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
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

  cancelBooking(bookingId: number): void {
    this.activeBookingId.set(bookingId);
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    this.toursService.cancelBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        this.bookings.update((bookings) =>
          bookings.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
        );
        this.success.set('Бронь успешно отменена.');
        this.activeBookingId.set(null);
      },
      error: (error) => {
        const key = getErrorKey(error);
        if (key) {
          this.errorKey.set(key);
        } else {
          this.errorText.set(getErrorMessage(error, this.i18n.t('errors.generic')));
        }
        this.activeBookingId.set(null);
      }
    });
  }
}
