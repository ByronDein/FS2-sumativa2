import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRules {
  min: boolean;
  max: boolean;
  upper: boolean;
  number: boolean;
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
  password(value: string): PasswordRules {
    return {
      min: value.length >= 6,
      max: value.length <= 18,
      upper: /[A-Z]/.test(value),
      number: /\d/.test(value),
    };
  }

  passwordOk(value: string): boolean {
    return Object.values(this.password(value)).every(Boolean);
  }

  email(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  phone(value: string): boolean {
    return /^[0-9+\s()-]{8,16}$/.test(value);
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value || '';
      return this.passwordOk(value) ? null : { passwordStrength: true };
    };
  }

  minAge(years: number): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age -= 1;

      return age >= years ? null : { minAge: { requiredAge: years, actualAge: age } };
    };
  }

  matchFields(fieldName: string, confirmName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const field = control.get(fieldName)?.value;
      const confirm = control.get(confirmName)?.value;
      return field === confirm ? null : { fieldsMismatch: true };
    };
  }
}
