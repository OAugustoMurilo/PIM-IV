import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  expiresAt?: string | number;
  tokenType?: string;
  [key: string]: unknown;
}

const TOKEN_KEY = 'nexhelp.auth.token';
const REFRESH_TOKEN_KEY = 'nexhelp.auth.refresh-token';
const EXPIRES_AT_KEY = 'nexhelp.auth.expires-at';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expiration = this.getExpirationTimestamp();
    if (!expiration) {
      return true;
    }

    return Date.now() < expiration;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private persistSession(response: LoginResponse | undefined): void {
    if (!response?.token) {
      return;
    }

    localStorage.setItem(TOKEN_KEY, response.token);

    if (response.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    const expiresAt = this.resolveExpiration(response);
    if (expiresAt) {
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
    }
  }

  private resolveExpiration(response: LoginResponse): number | null {
    if (response.expiresAt) {
      const value = typeof response.expiresAt === 'string' ? Date.parse(response.expiresAt) : Number(response.expiresAt);
      return Number.isFinite(value) ? value : null;
    }

    if (response.expiresIn) {
      return Date.now() + response.expiresIn * 1000;
    }

    return null;
  }

  private getExpirationTimestamp(): number | null {
    const stored = localStorage.getItem(EXPIRES_AT_KEY);
    if (!stored) {
      return null;
    }

    const value = Number(stored);
    return Number.isFinite(value) ? value : null;
  }
}
