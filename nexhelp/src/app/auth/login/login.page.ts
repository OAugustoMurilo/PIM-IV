import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { AuthService, LoginPayload } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loading = signal(false);
  readonly passwordVisible = signal(false);
  readonly errorMessage = signal('');

  readonly buttonLabel = computed(() => (this.loading() ? 'Entrando...' : 'Entrar'));

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const payload: LoginPayload = this.form.getRawValue();

    this.authService
      .login(payload)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: async () => {
          await this.router.navigate(['/home'], { replaceUrl: true });
        },
        error: (error) => {
          const details = error?.error?.message ?? error?.message ?? 'Verifique suas credenciais e tente novamente.';
          this.errorMessage.set(details);
        },
      });
  }

  hasError(controlName: 'email' | 'password', error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }
}
