import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppAlert, Product } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { StorageService } from '../../services/storage.service';

/**
 * Pantalla de detalle de producto.
 *
 * Recibe el id del producto desde la ruta /producto-detalle/:id y busca los
 * datos completos en ProductsService. Asi se navega desde el listado hacia
 * una pagina con mas informacion del producto seleccionado.
 */
@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly storage = inject(StorageService);

  /** Mensaje mostrado al agregar el producto al carrito. */
  alert: AppAlert | null = null;

  /** Id recibido desde el parametro de ruta. */
  productId = this.route.snapshot.paramMap.get('id') || '';

  /** Producto encontrado para el id de la ruta. */
  product: Product | null = this.productsService.byId(this.productId);
  loading = true;

  ngOnInit(): void {
    this.productsService.getById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        if (!this.product)
          this.alert = { type: 'danger', message: 'No se pudo encontrar el producto.' };
        this.cdr.detectChanges();
      },
    });
  }

  /** Agrega el producto actual al carrito del usuario autenticado. */
  addToCart(): void {
    if (!this.product || !this.auth.currentUser()) return;
    this.cart.add(this.product.id);
    this.alert = { type: 'success', message: 'Agregado ' + this.product.name + ' al carrito.' };
  }
}


