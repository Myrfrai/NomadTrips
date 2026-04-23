import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { getErrorKey, getErrorMessage } from '../core/api-error.util';
import {
  AdminTourOverview,
  AdminUserOverview,
  Booking,
  Destination,
  TourWritePayload
} from '../core/api.models';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

interface TourFormModel {
  id: number | null;
  destination: number | null;
  slug: string;
  title: string;
  summary: string;
  region_key: string;
  season_key: string;
  duration_text: string;
  departure_city: string;
  price: number;
  rating: number;
  popular: boolean;
  hero_label: string;
  image_url: string;
  is_published: boolean;
}

const createTourForm = (): TourFormModel => ({
  id: null,
  destination: null,
  slug: '',
  title: '',
  summary: '',
  region_key: 'almaty',
  season_key: 'mid',
  duration_text: '2 days / 1 night',
  departure_city: 'Almaty',
  price: 0,
  rating: 4.8,
  popular: false,
  hero_label: '',
  image_url: '',
  is_published: true
});

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly bookings = signal<Booking[]>([]);
  readonly adminUsers = signal<AdminUserOverview[]>([]);
  readonly adminTours = signal<AdminTourOverview[]>([]);
  readonly destinations = signal<Destination[]>([]);
  readonly loading = signal(false);
  readonly savingTour = signal(false);
  readonly deletingTourId = signal<number | null>(null);
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );
  readonly success = signal('');
  readonly activeBookingId = signal<number | null>(null);
  readonly isAdmin = computed(() => this.auth.user()?.role === 'manager');

  tourForm = createTourForm();

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.loading.set(true);
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    this.auth.loadProfile().pipe(catchError(() => of(this.auth.user()))).subscribe();

    const request = this.isAdmin()
      ? forkJoin({
          bookings: this.toursService.getMyBookings(),
          destinations: this.toursService.getDestinations(),
          adminUsers: this.toursService.getAdminUsersOverview(),
          adminTours: this.toursService.getAdminToursOverview()
        })
      : forkJoin({
          bookings: this.toursService.getMyBookings(),
          destinations: this.toursService.getDestinations()
        });

    request.subscribe({
      next: (response) => {
        this.bookings.set(response.bookings);
        this.destinations.set(response.destinations);
        this.adminUsers.set(
          'adminUsers' in response ? (response.adminUsers as AdminUserOverview[]) : []
        );
        this.adminTours.set(
          'adminTours' in response ? (response.adminTours as AdminTourOverview[]) : []
        );

        if (!this.tourForm.destination && response.destinations.length) {
          this.tourForm.destination = response.destinations[0].id;
        }

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

  submitTour(): void {
    if (!this.isAdmin()) {
      return;
    }

    if (!this.tourForm.destination) {
      this.errorText.set('Выберите направление для тура.');
      return;
    }

    this.savingTour.set(true);
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    const payload: TourWritePayload = {
      destination: this.tourForm.destination,
      slug: this.tourForm.slug.trim(),
      title: this.tourForm.title.trim(),
      summary: this.tourForm.summary.trim(),
      region_key: this.tourForm.region_key.trim(),
      season_key: this.tourForm.season_key.trim(),
      duration_text: this.tourForm.duration_text.trim(),
      departure_city: this.tourForm.departure_city.trim(),
      price: Number(this.tourForm.price),
      rating: Number(this.tourForm.rating),
      popular: this.tourForm.popular,
      hero_label: this.tourForm.hero_label.trim(),
      image_url: this.tourForm.image_url.trim(),
      is_published: this.tourForm.is_published
    };

    const request = this.tourForm.id
      ? this.toursService.updateTour(this.tourForm.id, payload)
      : this.toursService.createTour(payload);

    request.subscribe({
      next: () => {
        this.success.set(this.tourForm.id ? 'Тур обновлён.' : 'Тур создан.');
        this.resetTourForm();
        this.refreshDashboard();
        this.savingTour.set(false);
      },
      error: (error) => {
        const key = getErrorKey(error);
        if (key) {
          this.errorKey.set(key);
        } else {
          this.errorText.set(getErrorMessage(error, this.i18n.t('errors.generic')));
        }
        this.savingTour.set(false);
      }
    });
  }

  editTour(tour: AdminTourOverview): void {
    this.tourForm = {
      id: tour.id,
      destination: tour.destinationId,
      slug: tour.slug,
      title: tour.title,
      summary: tour.summary,
      region_key: tour.regionKey,
      season_key: tour.seasonKey,
      duration_text: tour.durationText,
      departure_city: tour.departureCity,
      price: tour.price,
      rating: tour.rating,
      popular: tour.popular,
      hero_label: tour.heroLabel,
      image_url: tour.imageUrl,
      is_published: tour.isPublished
    };
    this.success.set('');
    this.errorKey.set('');
    this.errorText.set('');
  }

  deleteTour(tourId: number): void {
    if (!this.isAdmin()) {
      return;
    }

    this.deletingTourId.set(tourId);
    this.errorKey.set('');
    this.errorText.set('');
    this.success.set('');

    this.toursService.deleteTour(tourId).subscribe({
      next: () => {
        this.success.set('Тур удалён.');
        if (this.tourForm.id === tourId) {
          this.resetTourForm();
        }
        this.refreshDashboard();
        this.deletingTourId.set(null);
      },
      error: (error) => {
        const key = getErrorKey(error);
        if (key) {
          this.errorKey.set(key);
        } else {
          this.errorText.set(getErrorMessage(error, this.i18n.t('errors.generic')));
        }
        this.deletingTourId.set(null);
      }
    });
  }

  resetTourForm(): void {
    const destinationId = this.destinations()[0]?.id ?? null;
    this.tourForm = {
      ...createTourForm(),
      destination: destinationId
    };
  }
}
