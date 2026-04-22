import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { getErrorKey, getErrorMessage } from '../core/api-error.util';
import { Tour, TourFilters } from '../core/api.models';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

const defaultFilters = (): TourFilters => ({
  search: '',
  region: '',
  season: '',
  maxPrice: ''
});

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.css'
})
export class TourListComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(false);
  readonly errorKey = signal('');
  readonly errorText = signal('');
  readonly error = computed(() =>
    this.errorKey() ? this.i18n.t(this.errorKey()) : this.errorText()
  );

  filters = defaultFilters();

  ngOnInit(): void {
    this.loadTours();
  }

  applyFilters(): void {
    this.loadTours();
  }

  resetFilters(): void {
    this.filters = defaultFilters();
    this.loadTours();
  }

  loadTours(): void {
    this.loading.set(true);
    this.errorKey.set('');
    this.errorText.set('');

    this.toursService.getTours(this.filters).subscribe({
      next: (tours) => {
        this.tours.set(tours);
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
