import { Component, inject } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApiService } from '../core/services/api.service';

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

  private readonly apiService = inject(ApiService);

  loadStatus(): void {
    this.loading = true;
    this.errorMessage = '';
    this.statusMessage = '';

    this.apiService
      .get<ApiStatusResponse>('status/health')
      .pipe(
        tap((response) => {
          this.statusMessage = response?.message ?? 'API respondeu com sucesso.';
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
}
