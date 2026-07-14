import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppAlert } from '../../models';
import { UsersService } from '../../services/users.service';
import { PasswordRules, ValidationService } from '../../services/validation.service';

type PasswordRuleKey = keyof PasswordRules;

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UsersService);
  private readonly validation = inject(ValidationService);
  private readonly router = inject(Router);

  alert: AppAlert | null = null;
  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,16}$/)]],
      address: ['', [Validators.minLength(5)]],
      birthDate: ['', [Validators.required, this.validation.minAge(13)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/),
        ],
      ],
      confirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
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

    if (this.users.byEmail(email)) {
      this.form.controls.email.setErrors({ exists: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los campos marcados antes de continuar.' };
      return;
    }

    this.users.create({
      name: this.form.controls.name.value?.trim() || '',
      email,
      phone: this.form.controls.phone.value?.trim() || '',
      address: this.form.controls.address.value?.trim() || '',
      birthDate: this.form.controls.birthDate.value || '',
      password: this.form.controls.password.value || '',
    });

    this.alert = { type: 'success', message: 'Cuenta creada con exito. Ya puedes iniciar sesion.' };
    setTimeout(() => void this.router.navigateByUrl('/login'), 700);
  }
}
