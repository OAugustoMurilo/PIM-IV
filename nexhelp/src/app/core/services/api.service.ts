import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      params: this.toHttpParams(params),
    });
  }

  post<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, {
      headers,
    });
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body);
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint));
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  }

  private toHttpParams(params?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!params) {
      return undefined;
    }
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      httpParams = httpParams.set(key, String(value));
    });
    return httpParams;
  }
}
