import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../auth.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { getErrorMessage } from '../core/api-error.util';
import { Tour } from '../core/api.models';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BookingFormComponent],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly toursService = inject(ToursService);

  readonly tour = signal<Tour | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadTour(id);
      }
    });
  }

  private loadTour(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.toursService.getTour(id).subscribe({
      next: (tour) => {
        this.tour.set(tour);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить карточку тура.'));
        this.tour.set(null);
        this.loading.set(false);
      }
    });
  }
}
