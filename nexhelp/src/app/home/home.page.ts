import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

interface ApiStatusResponse {
  message?: string;
  success?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  loading = false;
  statusMessage = '';
  errorMessage = '';
  lastCheckedAt: Date | null = null;

  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loadStatus(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.statusMessage = '';

    this.apiService
      .get<ApiStatusResponse>('status/health')
      .pipe(
        tap((response) => {
          this.statusMessage = response?.message ?? 'API respondeu com sucesso.';
          this.lastCheckedAt = new Date();
        }),
        catchError((error) => {
          const details = error?.error?.message ? ` Detalhes: ${error.error.message}` : '';
          this.errorMessage = `Não foi possível conectar à API.${details}`;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get tokenPreview(): string | null {
    const token = this.authService.getToken();
    if (!token) {
      return null;
    }

    if (token.length <= 14) {
      return token;
    }

    return `${token.slice(0, 6)}...${token.slice(-4)}`;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
