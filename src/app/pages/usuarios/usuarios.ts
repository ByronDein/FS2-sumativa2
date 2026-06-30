import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppAlert, UserRole } from '../../models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  readonly users = inject(UsersService);
  alert: AppAlert | null = null;

  changeRole(userId: string, role: string): void {
    this.users.changeRole(userId, role as UserRole);
    this.alert = { type: 'success', message: 'Rol actualizado.' };
  }

  toggleActive(userId: string): void {
    this.users.toggleActive(userId);
  }
}
