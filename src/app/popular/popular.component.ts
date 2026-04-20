import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { getErrorMessage } from '../core/api-error.util';
import { Tour } from '../core/api.models';
import { I18nService } from '../i18n.service';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly toursService = inject(ToursService);

  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadPopular();
  }

  loadPopular(): void {
    this.loading.set(true);
    this.error.set('');

    this.toursService.getPopularTours().subscribe({
      next: (tours) => {
        this.tours.set(tours);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить популярные туры.'));
        this.loading.set(false);
      }
    });
  }
}
