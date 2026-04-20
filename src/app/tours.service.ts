import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './core/app.constants';
import {
  Booking,
  BookingRequest,
  ContactRequest,
  ContactResponse,
  Tour,
  TourFilters
} from './core/api.models';

@Injectable({ providedIn: 'root' })
export class ToursService {
  private readonly http = inject(HttpClient);

  getTours(filters: TourFilters): Observable<Tour[]> {
    let params = new HttpParams();

    if (filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }

    if (filters.region) {
      params = params.set('region', filters.region);
    }

    if (filters.season) {
      params = params.set('season', filters.season);
    }

    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    return this.http.get<Tour[]>(`${API_BASE_URL}/tours`, { params });
  }

  getPopularTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${API_BASE_URL}/tours/popular`);
  }

  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${API_BASE_URL}/tours/${id}`);
  }

  createBooking(payload: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings`, payload);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${API_BASE_URL}/bookings/my`);
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings/${id}/cancel`, {});
  }

  createContactRequest(payload: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${API_BASE_URL}/contacts`, payload);
  }
}
