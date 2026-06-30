import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppAlert } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
})
export class Carrito {
  readonly cart = inject(CartService);
  readonly storage = inject(StorageService);
  private readonly auth = inject(AuthService);

  alert: AppAlert | null = null;

  checkout(): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const result = this.cart.checkout(user);
    this.alert = { type: result.ok ? 'success' : 'warning', message: result.message };
  }
}
