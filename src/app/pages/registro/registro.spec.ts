import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Registro } from './registro';

describe('Registro - Formulario reactivo', () => {
  let component: Registro;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el formulario correctamente', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.valid).toBeFalse();
  });

  it('debe iniciar con controles vacios', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('debe marcar como invalido un campo requerido vacio', () => {
    const name = component.form.get('name');

    name?.setValue('');

    expect(name?.hasError('required')).toBeTrue();
    expect(name?.valid).toBeFalse();
  });

  it('debe marcar error si el email tiene formato incorrecto', () => {
    const email = component.form.get('email');

    email?.setValue('correo-malo');

    expect(email?.hasError('email')).toBeTrue();
    expect(email?.valid).toBeFalse();
  });

  it('debe fallar si la edad es menor a 13 anos', () => {
    const birthDate = component.form.get('birthDate');

    birthDate?.setValue(new Date().toISOString().slice(0, 10));

    expect(birthDate?.hasError('minAge')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('debe fallar si la password no cumple el pattern', () => {
    const password = component.form.get('password');

    password?.setValue('abcdef');

    expect(password?.hasError('pattern')).toBeTrue();
    expect(password?.valid).toBeFalse();
  });

  it('debe fallar si las passwords no coinciden', () => {
    component.form.patchValue({
      password: 'Hola123',
      confirm: 'Otra123',
    });

    expect(component.form.hasError('fieldsMismatch')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('debe ser valido con datos correctos', () => {
    component.form.setValue({
      name: 'Cliente Test',
      email: 'cliente@test.cl',
      phone: '+56 9 1234 5678',
      address: '',
      birthDate: '2000-01-01',
      password: 'Hola123',
      confirm: 'Hola123',
      terms: true,
    });

    expect(component.form.errors).toBeNull();
    expect(component.form.valid).toBeTrue();
  });

  it('debe limpiar el formulario al ejecutar reset', () => {
    component.form.patchValue({
      name: 'Cliente Test',
      email: 'cliente@test.cl',
      password: 'Hola123',
      confirm: 'Hola123',
    });

    component.form.reset();

    expect(component.form.get('name')?.value).toBeNull();
    expect(component.form.get('email')?.value).toBeNull();
  });
});
