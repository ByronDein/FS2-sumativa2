import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppAlert, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { PasswordRules, ValidationService } from '../../services/validation.service';

type PasswordRuleKey = keyof PasswordRules;

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UsersService);
  private readonly validation = inject(ValidationService);

  alert: AppAlert | null = null;
  currentUser: User | null = this.auth.currentUser();
  form = this.fb.group(
    {
      name: [this.currentUser?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: [
        this.currentUser?.phone || '',
        [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,16}$/)],
      ],
      address: [this.currentUser?.address || '', [Validators.minLength(5)]],
      birthDate: [
        this.currentUser?.birthDate || '',
        [Validators.required, this.validation.minAge(13)],
      ],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/),
        ],
      ],
      confirm: [''],
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
    if (!this.currentUser) return;

    const newPassword = this.form.controls.password.value || '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los campos del perfil.' };
      return;
    }

    this.users.update({
      ...this.currentUser,
      name: this.form.controls.name.value?.trim() || '',
      email: this.form.controls.email.value?.trim().toLowerCase() || '',
      phone: this.form.controls.phone.value?.trim() || '',
      address: this.form.controls.address.value?.trim() || '',
      birthDate: this.form.controls.birthDate.value || '',
      password: newPassword || this.currentUser.password,
    });
    this.auth.refresh();
    this.currentUser = this.auth.currentUser();
    this.form.patchValue({ password: '', confirm: '' });
    this.alert = { type: 'success', message: 'Perfil actualizado.' };
  }
}
