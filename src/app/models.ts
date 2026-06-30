export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate?: string;
  password: string;
  role: UserRole;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  featured: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface CartRow extends CartItem {
  product: Product;
  subtotal: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  total: number;
}

export interface AppAlert {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info' | 'secondary';
}
