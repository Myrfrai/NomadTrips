import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';

import {
  API_BASE_URL,
  BOOKINGS_STORAGE_KEY,
  DEMO_BACKEND_ENABLED,
  INQUIRIES_STORAGE_KEY
} from './app.constants';
import {
  AuthResponse,
  Booking,
  BookingRequest,
  ContactRequest,
  ContactResponse,
  LoginCredentials,
  Tour,
  UserProfile
} from './api.models';
import { DEMO_TOURS, DEMO_USERS } from './demo-data';
import { createDemoJwt, decodeDemoJwt, isTokenExpired } from './jwt.util';

interface StoredInquiry extends ContactRequest {
  id: number;
  createdAt: string;
}

function jsonResponse<T>(body: T, status = 200): Observable<HttpEvent<T>> {
  return of(new HttpResponse({ status, body })).pipe(delay(350));
}

function errorResponse(status: number, message: string, messageKey = ''): Observable<never> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        error: { message, messageKey }
      })
  );
}

function parseUrl(url: string): URL {
  return new URL(url, 'https://nomadtrips.local');
}

function readToken(req: HttpRequest<unknown>): string | null {
  const header = req.headers.get('Authorization');
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

function getAuthorizedUser(req: HttpRequest<unknown>): UserProfile | null {
  const token = readToken(req);

  if (!token || isTokenExpired(token)) {
    return null;
  }

  const payload = decodeDemoJwt(token);
  if (!payload) {
    return null;
  }

  return {
    id: Number(payload.sub),
    name: payload.name,
    email: payload.email,
    role: payload.role
  };
}

function readBookings(): Booking[] {
  const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

function saveInquiry(payload: ContactRequest): ContactResponse {
  const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
  const inquiries = raw ? (JSON.parse(raw) as StoredInquiry[]) : [];
  const nextInquiry: StoredInquiry = {
    ...payload,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify([nextInquiry, ...inquiries]));

  return {
    id: nextInquiry.id,
    message: 'Сообщение отправлено. Мы свяжемся с вами в ближайшее время.'
  };
}

function filterTours(url: URL): Tour[] {
  const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
  const region = url.searchParams.get('region') ?? '';
  const season = url.searchParams.get('season') ?? '';
  const maxPrice = Number(url.searchParams.get('maxPrice') ?? 0);

  return DEMO_TOURS.filter((tour) => {
    const matchesSearch =
      !search ||
      [tour.name.ru, tour.name.kz, tour.name.en, tour.summary.ru, tour.summary.en]
        .join(' ')
        .toLowerCase()
        .includes(search);
    const matchesRegion = !region || tour.regionKey === region;
    const matchesSeason = !season || tour.seasonKey === season;
    const matchesPrice = !maxPrice || tour.price <= maxPrice;

    return matchesSearch && matchesRegion && matchesSeason && matchesPrice;
  });
}

function login(body: LoginCredentials | null): Observable<HttpEvent<AuthResponse>> {
  if (!body?.email || !body.password) {
    return errorResponse(400, 'Введите email и пароль.', 'errors.loginRequired');
  }

  const user = DEMO_USERS.find(
    (candidate) =>
      candidate.email.toLowerCase() === body.email.trim().toLowerCase() &&
      candidate.password === body.password
  );

  if (!user) {
    return errorResponse(401, 'Неверные логин или пароль.', 'errors.invalidCredentials');
  }

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return jsonResponse({
    access: createDemoJwt(profile, 90),
    refresh: createDemoJwt(profile, 24 * 60),
    user: profile
  });
}

function createBooking(req: HttpRequest<unknown>, body: BookingRequest | null): Observable<HttpEvent<Booking>> {
  const user = getAuthorizedUser(req);
  if (!user) {
    return errorResponse(401, 'Сначала войдите в аккаунт, чтобы забронировать тур.', 'errors.bookingAuth');
  }

  if (!body?.tourId || !body.fullName || !body.phone || !body.travelDate || !body.travelers) {
    return errorResponse(400, 'Заполните обязательные поля формы бронирования.', 'errors.bookingRequired');
  }

  const tour = DEMO_TOURS.find((item) => item.id === body.tourId);
  if (!tour) {
    return errorResponse(404, 'Тур не найден.', 'errors.tourNotFound');
  }

  const bookings = readBookings();
  const booking: Booking = {
    id: Date.now(),
    userId: user.id,
    tourId: tour.id,
    tourName: tour.name,
    travelers: body.travelers,
    travelDate: body.travelDate,
    totalPrice: tour.price * body.travelers,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  saveBookings([{ ...booking }, ...bookings.filter((item) => item.id !== booking.id)]);

  return jsonResponse(booking, 201);
}

function cancelBooking(req: HttpRequest<unknown>, bookingId: number): Observable<HttpEvent<Booking>> {
  const user = getAuthorizedUser(req);
  if (!user) {
    return errorResponse(401, 'Нужно авторизоваться.', 'errors.authRequired');
  }

  const bookings = readBookings();
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return errorResponse(404, 'Бронь не найдена.', 'errors.bookingNotFound');
  }

  if (booking.userId !== user.id) {
    return errorResponse(403, 'Нельзя менять чужую бронь.', 'errors.bookingForbidden');
  }

  const updatedBooking: Booking = { ...booking, status: 'cancelled' };
  saveBookings(bookings.map((item) => (item.id === bookingId ? updatedBooking : item)));

  return jsonResponse(updatedBooking);
}

export const demoBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (!DEMO_BACKEND_ENABLED || !req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  const url = parseUrl(req.url);
  const path = url.pathname;

  if (req.method === 'POST' && path === `${API_BASE_URL}/auth/login`) {
    return login(req.body as LoginCredentials | null);
  }

  if (req.method === 'POST' && path === `${API_BASE_URL}/auth/logout`) {
    return jsonResponse(null, 204);
  }

  if (req.method === 'GET' && path === `${API_BASE_URL}/auth/me`) {
    const user = getAuthorizedUser(req);
    return user ? jsonResponse(user) : errorResponse(401, 'Сессия истекла. Войдите снова.', 'errors.sessionExpired');
  }

  if (req.method === 'GET' && path === `${API_BASE_URL}/tours`) {
    return jsonResponse(filterTours(url));
  }

  if (req.method === 'GET' && path === `${API_BASE_URL}/tours/popular`) {
    return jsonResponse(DEMO_TOURS.filter((tour) => tour.popular));
  }

  if (req.method === 'GET' && /^\/api\/tours\/\d+$/.test(path)) {
    const tourId = Number(path.split('/').pop());
    const tour = DEMO_TOURS.find((item) => item.id === tourId);
    return tour ? jsonResponse(tour) : errorResponse(404, 'Тур не найден.', 'errors.tourNotFound');
  }

  if (req.method === 'POST' && path === `${API_BASE_URL}/bookings`) {
    return createBooking(req, req.body as BookingRequest | null);
  }

  if (req.method === 'GET' && path === `${API_BASE_URL}/bookings/my`) {
    const user = getAuthorizedUser(req);
    return user
      ? jsonResponse(readBookings().filter((booking) => booking.userId === user.id))
      : errorResponse(401, 'Войдите, чтобы открыть личный кабинет.');
  }

  if (req.method === 'POST' && /^\/api\/bookings\/\d+\/cancel$/.test(path)) {
    const bookingId = Number(path.split('/')[3]);
    return cancelBooking(req, bookingId);
  }

  if (req.method === 'POST' && path === `${API_BASE_URL}/contacts`) {
    return jsonResponse(saveInquiry(req.body as ContactRequest), 201);
  }

  return errorResponse(404, `Эндпоинт ${path} не настроен в demo API.`);
};
