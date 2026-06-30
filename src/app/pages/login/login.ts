import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppAlert } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  alert: AppAlert | null = null;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loadDemo(): void {
    this.form.patchValue({
      email: 'cliente@techmart.local',
      password: 'Cliente2026!',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los campos marcados antes de continuar.' };
      return;
    }

    const user = this.auth.login(this.form.controls.email.value || '', this.form.controls.password.value || '');
    if (!user) {
      this.alert = { type: 'danger', message: 'Credenciales invalidas o usuario bloqueado.' };
      return;
    }

    void this.router.navigateByUrl(user.role === 'admin' ? '/admin' : '/tienda');
  }
}
