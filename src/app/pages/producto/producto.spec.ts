import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Producto } from './producto';

describe('Producto - Formulario reactivo', () => {
  let component: Producto;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Producto],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Producto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el formulario correctamente', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.valid).toBeFalse();
  });

  it('debe exigir nombre del producto', () => {
    const name = component.form.get('name');

    name?.setValue('');

    expect(name?.hasError('required')).toBeTrue();
    expect(name?.valid).toBeFalse();
  });

  it('debe rechazar precio cero', () => {
    const price = component.form.get('price');

    price?.setValue(0);

    expect(price?.hasError('min')).toBeTrue();
    expect(price?.valid).toBeFalse();
  });

  it('debe ser valido con datos correctos', () => {
    component.form.setValue({
      id: '',
      name: 'Producto Test',
      brand: 'Marca',
      category: 'Laptops',
      price: 1000,
      stock: 5,
      image: 'assets/img/products/laptop.svg',
      description: 'Descripcion valida',
      featured: false,
    });

    expect(component.form.valid).toBeTrue();
  });

  it('debe limpiar el formulario con clear', () => {
    component.form.patchValue({
      name: 'Producto Test',
      brand: 'Marca',
    });

    component.clear();

    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('brand')?.value).toBe('');
  });
});
