
export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export type Category = 'Biryani' | 'Burgers' | 'Pizza' | 'South Indian' | 'Desserts' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'user' | 'admin';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  address: string;
  coordinates: { lat: number; lng: number };
  createdAt: string;
  paymentId?: string;
  deliveryTime?: string;
}

export interface AppState {
  menu: MenuItem[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
}
