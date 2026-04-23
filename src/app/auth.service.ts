import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  API_BASE_URL,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY
} from './core/app.constants';
import { AuthResponse, LoginCredentials, RegisterPayload, UserProfile } from './core/api.models';
import { decodeDemoJwt, isTokenExpired } from './core/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly accessTokenState = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY));
  private readonly refreshTokenState = signal<string | null>(
    localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
  );
  private readonly userState = signal<UserProfile | null>(this.readStoredUser());

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(
    () => !!this.accessTokenState() && !isTokenExpired(this.accessTokenState())
  );

  constructor() {
    this.restoreSession();
  }

  accessToken(): string | null {
    return this.accessTokenState();
  }

  login(credentials: LoginCredentials): Observable<UserProfile> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials).pipe(
      tap((response) => this.persistSession(response)),
      map((response) => response.user)
    );
  }

  register(payload: RegisterPayload): Observable<UserProfile> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, payload).pipe(
      tap((response) => this.persistSession(response)),
      map((response) => response.user)
    );
  }

  loadProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE_URL}/auth/me`).pipe(
      tap((user) => {
        this.userState.set(user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      })
    );
  }

  logout(redirectToLogin = true): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/logout`, { refresh: this.refreshTokenState() ?? '' }).pipe(
      catchError(() => of(void 0)),
      tap(() => {
        this.clearSession();

        if (redirectToLogin) {
          void this.router.navigate(['/login']);
        }
      })
    );
  }

  private restoreSession(): void {
    const token = this.accessTokenState();

    if (!token || isTokenExpired(token)) {
      this.clearSession();
      return;
    }

    if (!this.userState()) {
      const payload = decodeDemoJwt(token);
      if (payload) {
        this.userState.set({
          id: Number(payload.sub),
          name: payload.name,
          email: payload.email,
          role: payload.role
        });
      }
    }
  }

  private persistSession(response: AuthResponse): void {
    this.accessTokenState.set(response.access);
    this.refreshTokenState.set(response.refresh);
    this.userState.set(response.user);

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.access);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refresh);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  }

  private clearSession(): void {
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.userState.set(null);

    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private readStoredUser(): UserProfile | null {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as UserProfile;
    } catch {
      return null;
    }
  }
}
