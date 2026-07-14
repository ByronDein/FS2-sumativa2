import { Injectable, inject, signal } from '@angular/core';
import { User } from '../models';
import { StorageService } from './storage.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly usersService = inject(UsersService);
  private readonly currentUserState = signal<User | null>(this.loadCurrentUser());

  readonly currentUser = this.currentUserState.asReadonly();

  login(email: string, password: string): User | null {
    const user = this.usersService
      .all()
      .find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
      );

    if (!user || !user.active) return null;

    this.storage.write(this.storage.keys.session, { userId: user.id });
    this.currentUserState.set(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem(this.storage.keys.session);
    this.currentUserState.set(null);
  }

  refresh(): void {
    this.currentUserState.set(this.loadCurrentUser());
  }

  private loadCurrentUser(): User | null {
    const session = this.storage.read<{ userId: string } | null>(this.storage.keys.session, null);
    if (!session?.userId) return null;
    return this.usersService.byId(session.userId);
  }
}
