export type OrderStatus = 'Pending' | 'InProgress' | 'Completed';

export interface Product {
  id: number;
  name: string;
  unit_price: number;
}

export interface ProductCreate {
  name: string;
  unit_price: number;
}

export interface ProductUpdate {
  name?: string;
  unit_price?: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  date: string;
  num_products: number;
  final_price: number;
  status: OrderStatus;
  is_deleted: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface OrderCreate {
  order_number: string;
}

export interface OrderUpdate {
  order_number?: string;
  status?: OrderStatus;
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
}

export interface OrderItemUpdate {
  quantity: number;
}
