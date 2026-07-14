import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppAlert, Product } from '../../models';
import { ProductsService } from '../../services/products.service';
import { StorageService } from '../../services/storage.service';

/** Mantenedor de productos conectado al CRUD REST de json-server. */
@Component({
  selector: 'app-producto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly cdr = inject(ChangeDetectorRef);

  alert: AppAlert | null = null;
  loading = false;
  products: Product[] = [];
  categories = this.storage.categories.filter((category) => category !== 'Todos');
  form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    brand: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    category: ['Laptops', Validators.required],
    price: [0, [Validators.required, Validators.min(1), Validators.max(99999999)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
    image: ['assets/img/products/laptop.svg', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
    featured: [false],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Obtiene productos mediante GET desde db.json. */
  loadProducts(): void {
    this.loading = true;
    this.productsService.load().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.products = this.productsService.all();
        this.loading = false;
        this.alert = {
          type: 'danger',
          message: 'No se pudo conectar con json-server en el puerto 3000.',
        };
        this.cdr.detectChanges();
      },
    });
  }

  /** Crea con POST o actualiza con PUT segun exista un id. */
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert = { type: 'danger', message: 'Revisa los datos del producto.' };
      return;
    }

    const editing = Boolean(this.form.controls.id.value);
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

    this.loading = true;
    const request = editing
      ? this.productsService.update(product)
      : this.productsService.create(product);
    request.subscribe({
      next: () => {
        this.products = this.productsService.all();
        this.alert = {
          type: 'success',
          message: editing ? 'Producto actualizado.' : 'Producto creado.',
        };
        this.loading = false;
        this.clear();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alert = {
          type: 'danger',
          message: 'No se pudo guardar. Verifica que json-server este ejecutandose.',
        };
        this.cdr.detectChanges();
      },
    });
  }

  edit(product: Product): void {
    this.form.patchValue(product);
    this.alert = null;
  }

  /** Elimina el registro mediante DELETE. */
  delete(productId: string): void {
    if (!confirm('Â¿Eliminar este producto?')) return;
    this.productsService.remove(productId).subscribe({
      next: () => {
        this.products = this.productsService.all();
        this.alert = { type: 'success', message: 'Producto eliminado.' };
        this.cdr.detectChanges();
      },
      error: () => {
        this.alert = { type: 'danger', message: 'No se pudo eliminar el producto.' };
        this.cdr.detectChanges();
      },
    });
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


