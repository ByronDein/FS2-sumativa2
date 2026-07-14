import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly apiUrl = this.resolveApiUrl();

  private resolveApiUrl(): string {
    return window.location.port === '8080' ? '/api/productos' : 'http://localhost:3000/productos';
  }

  private withCacheBuster(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + '_=' + Date.now();
  }

  all(): Product[] {
    return this.storage.read<Product[]>(this.storage.keys.products, []);
  }

  load(): Observable<Product[]> {
    return this.http.get<Product[]>(this.withCacheBuster(this.apiUrl)).pipe(tap((products) => this.save(products)));
  }

  getById(productId: string): Observable<Product> {
    return this.http
      .get<Product>(this.withCacheBuster(this.apiUrl + '/' + productId))
      .pipe(tap((product) => this.saveOneLocal(product)));
  }

  byId(productId: string): Product | null {
    return this.all().find((product) => product.id === productId) || null;
  }

  create(product: Product): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(tap((created) => this.saveOneLocal(created)));
  }

  update(product: Product): Observable<Product> {
    return this.http
      .put<Product>(this.apiUrl + '/' + product.id, product)
      .pipe(tap((updated) => this.saveOneLocal(updated)));
  }

  remove(productId: string): Observable<void> {
    return this.http
      .delete<void>(this.apiUrl + '/' + productId)
      .pipe(tap(() => this.save(this.all().filter((product) => product.id !== productId))));
  }

  save(products: Product[]): void {
    this.storage.write(this.storage.keys.products, products);
  }

  private saveOneLocal(product: Product): void {
    const products = this.all();
    const index = products.findIndex((item) => item.id === product.id);
    if (index >= 0) products[index] = product;
    else products.unshift(product);
    this.save(products);
  }
}

