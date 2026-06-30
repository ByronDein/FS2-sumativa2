import { Injectable, inject } from '@angular/core';
import { Order } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly storage = inject(StorageService);

  all(): Order[] {
    return this.storage.read<Order[]>(this.storage.keys.orders, []);
  }

  save(orders: Order[]): void {
    this.storage.write(this.storage.keys.orders, orders);
  }

  byUser(userId: string): Order[] {
    return this.all().filter((order) => order.userId === userId);
  }
}
