import { Injectable, inject } from '@angular/core';
import { User, UserRole } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly storage = inject(StorageService);

  all(): User[] {
    return this.storage.read<User[]>(this.storage.keys.users, []);
  }

  save(users: User[]): void {
    this.storage.write(this.storage.keys.users, users);
  }

  byId(userId: string): User | null {
    return this.all().find((user) => user.id === userId) || null;
  }

  byEmail(email: string): User | null {
    const cleanEmail = email.trim().toLowerCase();
    return this.all().find((user) => user.email.toLowerCase() === cleanEmail) || null;
  }

  create(data: Omit<User, 'id' | 'role' | 'active'>): User {
    const users = this.all();
    const user: User = {
      ...data,
      id: this.storage.uid('u'),
      email: data.email.trim().toLowerCase(),
      role: 'customer',
      active: true,
    };
    users.push(user);
    this.save(users);
    return user;
  }

  update(user: User): void {
    const users = this.all();
    const index = users.findIndex((item) => item.id === user.id);
    if (index < 0) return;
    users[index] = user;
    this.save(users);
  }

  changeRole(userId: string, role: UserRole): void {
    const user = this.byId(userId);
    if (!user) return;
    this.update({ ...user, role });
  }

  toggleActive(userId: string): void {
    const user = this.byId(userId);
    if (!user) return;
    this.update({ ...user, active: !user.active });
  }
}
