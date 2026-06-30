import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { AppAlert, Order, Product } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';
import { StorageService } from '../../services/storage.service';

/**
 * Pantalla de catalogo y compras.
 *
 * Usa ngModel para enlazar los filtros de categoria y busqueda con variables
 * del componente. Los formularios principales de la app siguen usando
 * ReactiveFormsModule; ngModel se usa aqui para demostrar directivas Angular
 * sin mezclarlo con formControlName.
 */
@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule, RouterLink, ProductCard],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly storage = inject(StorageService);
  private readonly productsService = inject(ProductsService);
  private readonly ordersService = inject(OrdersService);

  /** Mensaje de alerta visible en la pantalla. */
  alert: AppAlert | null = null;

  /** Categorias del catalogo usadas por el select con ngModel. */
  categories = this.storage.categories;

  /** Valor conectado al select de categoria mediante [(ngModel)]. */
  selectedCategory = 'Todos';

  /** Texto conectado al input de busqueda mediante [(ngModel)]. */
  searchText = '';

  /** Filtra productos por categoria y texto buscado. */
  products(): Product[] {
    const text = this.searchText.trim().toLowerCase();
    return this.productsService.all().filter((product) => {
      const matchCategory = this.selectedCategory === 'Todos' || product.category === this.selectedCategory;
      const matchSearch =
        !text ||
        [product.name, product.brand, product.category, product.description].some((value) => value.toLowerCase().includes(text));
      return matchCategory && matchSearch;
    });
  }

  /** Obtiene los pedidos del usuario actual para mostrarlos en la tienda. */
  userOrders(): Order[] {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.ordersService.byUser(user.id).slice().reverse();
  }

  /** Evento asociado a keyup/change de filtros para limpiar alertas anteriores. */
  searchEvent(): void {
    this.alert = null;
  }

  /** Recibe el producto emitido por ProductCard y lo agrega al carrito. */
  addProduct(product: Product): void {
    this.cart.add(product.id);
    this.alert = { type: 'success', message: 'Agregado ' + product.name + ' al carrito.' };
  }

  /** Simula el pago del carrito del usuario actual. */
  checkout(): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const result = this.cart.checkout(user);
    this.alert = { type: result.ok ? 'success' : 'warning', message: result.message };
  }
}
