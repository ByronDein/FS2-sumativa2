import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../../models';
import { StorageService } from '../../services/storage.service';

/**
 * Tarjeta reutilizable para mostrar un producto del catalogo.
 *
 * Recibe los datos desde el componente padre con @Input y emite el evento
 * de agregar al carrito con @Output. Esto documenta el paso de datos entre
 * componentes pedido en la pauta.
 */
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  /** Producto recibido desde Tienda mediante property binding. */
  @Input({ required: true }) product!: Product;

  /** Evento que avisa al componente padre que debe agregar el producto. */
  @Output() addProduct = new EventEmitter<Product>();

  /** Servicio usado para formatear precios en pesos chilenos. */
  readonly storage = inject(StorageService);

  /** Emite el producto seleccionado al componente padre. */
  add(): void {
    this.addProduct.emit(this.product);
  }
}
