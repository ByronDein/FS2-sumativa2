import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppAlert } from '../../models';
import { UsersService } from '../../services/users.service';
import { PasswordRules, ValidationService } from '../../services/validation.service';

type PasswordRuleKey = keyof PasswordRules;

@Component({
  selector: 'app-recuperar',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css',
})
export class Recuperar {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UsersService);
  private readonly validation = inject(ValidationService);
  private readonly router = inject(Router);

  alert: AppAlert | null = null;
  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/),
      ]],
      confirm: ['', Validators.required],
    },
    { validators: this.validation.matchFields('password', 'confirm') },
  );
  ruleLabels: { key: PasswordRuleKey; label: string }[] = [
    { key: 'min', label: 'Minimo 6 caracteres' },
    { key: 'max', label: 'Maximo 18 caracteres' },
    { key: 'upper', label: 'Una mayuscula' },
    { key: 'number', label: 'Un numero' },
  ];

  passwordRules(): PasswordRules {
    return this.validation.password(this.form.controls.password.value || '');
  }

  submit(): void {
    const email = (this.form.controls.email.value || '').trim().toLowerCase();
    const user = this.users.byEmail(email);

    if (!user) this.form.controls.email.setErrors({ missing: true });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los campos marcados antes de continuar.' };
      return;
    }

    this.users.update({ ...user!, password: this.form.controls.password.value || '' });
    this.alert = { type: 'success', message: 'Contrasena actualizada. Ya puedes iniciar sesion.' };
    setTimeout(() => void this.router.navigateByUrl('/login'), 700);
  }
}
