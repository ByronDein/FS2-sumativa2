import { Injectable } from '@angular/core';
import { CartItem, Order, Product, User } from '../models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly keys = {
    users: 'techmart-users',
    products: 'techmart-products',
    orders: 'techmart-orders',
    cart: 'techmart-cart',
    session: 'techmart-session',
  };

  readonly categories = ['Todos', 'Laptops', 'PC Gamer', 'Componentes', 'Perifericos', 'Monitores', 'Almacenamiento'];

  private readonly demoUsers: User[] = [
    {
      id: 'u-admin',
      name: 'Administrador TechMart',
      email: 'admin@techmart.local',
      phone: '+56 9 1111 1111',
      address: 'Casa central, Santiago',
      password: 'AdminTech2026!',
      role: 'admin',
      active: true,
    },
    {
      id: 'u-client',
      name: 'Cliente Demo',
      email: 'cliente@techmart.local',
      phone: '+56 9 2222 2222',
      address: 'Las Condes, Santiago',
      password: 'Cliente2026!',
      role: 'customer',
      active: true,
    },
  ];

  private readonly demoProducts: Product[] = [
    {
      id: 'p-1',
      name: 'Laptop Lenovo IdeaPad 5',
      brand: 'Lenovo',
      category: 'Laptops',
      price: 699990,
      stock: 8,
      image: 'assets/img/products/laptop.svg',
      description: 'Notebook liviano para estudio, oficina y navegacion diaria con SSD y autonomia amplia.',
      featured: true,
    },
    {
      id: 'p-2',
      name: 'Procesador AMD Ryzen 5 5600',
      brand: 'AMD',
      category: 'Componentes',
      price: 149990,
      stock: 14,
      image: 'assets/img/products/chip.svg',
      description: 'Procesador de 6 nucleos para equipos balanceados y gaming de entrada.',
      featured: true,
    },
    {
      id: 'p-3',
      name: 'Tarjeta de video RTX 4060',
      brand: 'NVIDIA',
      category: 'PC Gamer',
      price: 449990,
      stock: 5,
      image: 'assets/img/products/gpu.svg',
      description: 'GPU de ultima generacion para juegos competitivos y creacion de contenido.',
      featured: true,
    },
    {
      id: 'p-4',
      name: "Monitor 27'' 144Hz",
      brand: 'AOC',
      category: 'Monitores',
      price: 219990,
      stock: 10,
      image: 'assets/img/products/monitor.svg',
      description: 'Monitor amplio y fluido para trabajo visual y experiencia gamer mas comoda.',
      featured: false,
    },
    {
      id: 'p-5',
      name: 'RAM DDR4 16GB',
      brand: 'Kingston',
      category: 'Componentes',
      price: 54990,
      stock: 20,
      image: 'assets/img/products/ram.svg',
      description: 'Memoria para mejorar multitarea y rendimiento general del equipo.',
      featured: false,
    },
    {
      id: 'p-6',
      name: 'SSD NVMe 1TB',
      brand: 'Western Digital',
      category: 'Almacenamiento',
      price: 78990,
      stock: 18,
      image: 'assets/img/products/ssd.svg',
      description: 'Almacenamiento veloz para arranque rapido y carga agil de aplicaciones.',
      featured: false,
    },
    {
      id: 'p-7',
      name: 'Teclado mecanico RGB',
      brand: 'Redragon',
      category: 'Perifericos',
      price: 49990,
      stock: 12,
      image: 'assets/img/products/keyboard.svg',
      description: 'Teclado robusto con iluminacion para estaciones de trabajo o gaming.',
      featured: false,
    },
  ];

  constructor() {
    this.seedDemoData();
  }

  read<T>(key: string, fallback: T): T {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallback;

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  seedDemoData(): void {
    if (!this.read<User[] | null>(this.keys.users, null)) this.write(this.keys.users, this.clone(this.demoUsers));
    if (!this.read<Product[] | null>(this.keys.products, null)) this.write(this.keys.products, this.clone(this.demoProducts));
    if (!this.read<Order[] | null>(this.keys.orders, null)) this.write(this.keys.orders, this.demoOrders());
    if (!this.read<CartItem[] | null>(this.keys.cart, null)) this.write(this.keys.cart, []);
  }

  resetDemo(): void {
    this.write(this.keys.users, this.clone(this.demoUsers));
    this.write(this.keys.products, this.clone(this.demoProducts));
    this.write(this.keys.orders, this.demoOrders());
    this.write(this.keys.cart, []);
    localStorage.removeItem(this.keys.session);
  }

  uid(prefix: string): string {
    return prefix + '-' + Math.random().toString(36).slice(2, 10);
  }

  money(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private demoOrders(): Order[] {
    return [
      {
        id: 'o-1',
        userId: 'u-client',
        userName: 'Cliente Demo',
        userEmail: 'cliente@techmart.local',
        createdAt: new Date().toISOString(),
        status: 'Pagado',
        items: [{ productId: 'p-6', name: 'SSD NVMe 1TB', qty: 1, price: 78990 }],
        total: 78990,
      },
    ];
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
