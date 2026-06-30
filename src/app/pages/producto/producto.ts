import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppAlert, Product } from '../../models';
import { ProductsService } from '../../services/products.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto {
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);

  alert: AppAlert | null = null;
  categories = this.storage.categories.filter((category) => category !== 'Todos');
  form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', Validators.required],
    category: ['Laptops', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    image: ['assets/img/products/laptop.svg', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    featured: [false],
  });

  products(): Product[] {
    return this.productsService.all();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los datos del producto.' };
      return;
    }

    const product: Product = {
      id: this.form.controls.id.value || this.storage.uid('p'),
      name: this.form.controls.name.value?.trim() || '',
      brand: this.form.controls.brand.value?.trim() || '',
      category: this.form.controls.category.value || 'Laptops',
      price: Number(this.form.controls.price.value),
      stock: Number(this.form.controls.stock.value),
      image: this.form.controls.image.value?.trim() || '',
      description: this.form.controls.description.value?.trim() || '',
      featured: Boolean(this.form.controls.featured.value),
    };
    this.productsService.saveOne(product);
    this.alert = { type: 'success', message: 'Producto guardado.' };
    this.clear();
  }

  edit(product: Product): void {
    this.form.patchValue(product);
  }

  delete(productId: string): void {
    this.productsService.delete(productId);
  }

  clear(): void {
    this.form.reset({
      id: '',
      name: '',
      brand: '',
      category: 'Laptops',
      price: 0,
      stock: 0,
      image: 'assets/img/products/laptop.svg',
      description: '',
      featured: false,
    });
  }
}
