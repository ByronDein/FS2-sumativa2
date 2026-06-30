import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Order, User } from '../../models';
import { OrdersService } from '../../services/orders.service';
import { StorageService } from '../../services/storage.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
})
export class Pedidos {
  readonly ordersService = inject(OrdersService);
  readonly storage = inject(StorageService);
  private readonly usersService = inject(UsersService);

  orders(): Order[] {
    return this.ordersService.all().slice().reverse();
  }

  buyer(order: Order): User | null {
    return this.usersService.byId(order.userId);
  }
}
