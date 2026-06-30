import { Injectable, inject } from '@angular/core';
import { Product } from '../models';
import { StorageService } from './storage.service';

/**
 * Servicio encargado del catalogo de productos.
 *
 * Lee y guarda productos en localStorage para compartirlos entre tienda,
 * carrito, mantenedor y pantalla de detalle.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly storage = inject(StorageService);

  /** Retorna todos los productos guardados. */
  all(): Product[] {
    return this.storage.read<Product[]>(this.storage.keys.products, []);
  }

  /** Busca un producto por id para mostrarlo en producto-detalle. */
  byId(productId: string): Product | null {
    return this.all().find((product) => product.id === productId) || null;
  }

  /** Guarda la lista completa de productos. */
  save(products: Product[]): void {
    this.storage.write(this.storage.keys.products, products);
  }

  /** Crea o actualiza un producto del catalogo. */
  saveOne(product: Product): void {
    const products = this.all();
    const index = products.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.save(products);
  }

  /** Elimina un producto por id. */
  delete(productId: string): void {
    this.save(this.all().filter((product) => product.id !== productId));
  }
}
