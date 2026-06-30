import { Injectable, inject } from '@angular/core';
import { CartItem, CartRow, User } from '../models';
import { OrdersService } from './orders.service';
import { ProductsService } from './products.service';
import { StorageService } from './storage.service';

/**
 * Servicio encargado de manejar el carrito de compras.
 *
 * Centraliza lectura/escritura en localStorage y crea pedidos al simular pago.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  private readonly productsService = inject(ProductsService);
  private readonly ordersService = inject(OrdersService);

  /** Retorna los items guardados en el carrito. */
  all(): CartItem[] {
    return this.storage.read<CartItem[]>(this.storage.keys.cart, []);
  }

  /** Guarda el carrito completo en localStorage. */
  save(cart: CartItem[]): void {
    this.storage.write(this.storage.keys.cart, cart);
  }

  /** Combina items del carrito con datos completos de producto. */
  rows(): CartRow[] {
    const products = this.productsService.all();
    return this.all()
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        return { ...item, product, subtotal: product.price * item.qty };
      })
      .filter((item): item is CartRow => item !== null);
  }

  /** Calcula la cantidad total de unidades en carrito. */
  count(): number {
    return this.rows().reduce((sum, item) => sum + item.qty, 0);
  }

  /** Calcula el total monetario del carrito. */
  total(): number {
    return this.rows().reduce((sum, item) => sum + item.subtotal, 0);
  }

  /** Agrega una unidad del producto al carrito. */
  add(productId: string): void {
    const cart = this.all();
    const item = cart.find((entry) => entry.productId === productId);
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ productId, qty: 1 });
    }
    this.save(cart);
  }

  /** Elimina un producto completo del carrito. */
  remove(productId: string): void {
    this.save(this.all().filter((item) => item.productId !== productId));
  }

  /** Resta una unidad y elimina el item si queda en cero. */
  minus(productId: string): void {
    const cart = this.all();
    const item = cart.find((entry) => entry.productId === productId);
    if (!item) return;
    item.qty -= 1;
    this.save(item.qty <= 0 ? cart.filter((entry) => entry.productId !== productId) : cart);
  }

  /** Suma una unidad de un producto ya presente en el carrito. */
  plus(productId: string): void {
    const cart = this.all();
    const item = cart.find((entry) => entry.productId === productId);
    if (!item) return;
    item.qty += 1;
    this.save(cart);
  }

  /** Valida stock, descuenta productos, crea un pedido y vacia el carrito. */
  checkout(user: User): { ok: boolean; message: string; total: number } {
    const cart = this.all();
    if (!cart.length) return { ok: false, message: 'El carrito esta vacio.', total: 0 };

    const products = this.productsService.all();
    const orderItems = [];
    let total = 0;

    for (const item of cart) {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product || product.stock < item.qty) {
        return { ok: false, message: 'Stock insuficiente para ' + (product ? product.name : 'un producto') + '.', total: 0 };
      }

      product.stock -= item.qty;
      orderItems.push({ productId: product.id, name: product.name, qty: item.qty, price: product.price });
      total += product.price * item.qty;
    }

    const orders = this.ordersService.all();
    orders.push({
      id: this.storage.uid('o'),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      status: 'Pagado',
      items: orderItems,
      total,
    });

    this.productsService.save(products);
    this.ordersService.save(orders);
    this.save([]);

    return { ok: true, message: 'Pago simulado con exito por ' + this.storage.money(total) + '.', total };
  }
}
