import { Routes } from '@angular/router';

import { adminGuard, authGuard } from './guards';

import { Admin } from './pages/admin/admin';

import { Carrito } from './pages/carrito/carrito';

import { Inicio } from './pages/inicio/inicio';

import { Login } from './pages/login/login';

import { Pedidos } from './pages/pedidos/pedidos';

import { Perfil } from './pages/perfil/perfil';

import { Producto } from './pages/producto/producto';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';

import { Recuperar } from './pages/recuperar/recuperar';

import { Registro } from './pages/registro/registro';

import { Tienda } from './pages/tienda/tienda';

import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [
  { path: '', component: Inicio },

  { path: 'login', component: Login },

  { path: 'registro', component: Registro },

  { path: 'recuperar', component: Recuperar },

  { path: 'tienda', component: Tienda, canActivate: [authGuard] },

  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: 'producto-detalle/:id', component: ProductoDetalle, canActivate: [authGuard] },

  { path: 'perfil', component: Perfil, canActivate: [authGuard] },

  { path: 'admin', component: Admin, canActivate: [adminGuard] },

  { path: 'admin/productos', component: Producto, canActivate: [adminGuard] },

  { path: 'admin/usuarios', component: Usuarios, canActivate: [adminGuard] },

  { path: 'admin/pedidos', component: Pedidos, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' },
];
