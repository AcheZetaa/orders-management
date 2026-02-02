export type OrderStatus = 'Pending' | 'InProgress' | 'Completed';

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

export interface OrderCreate {
  order_number: string;
  num_products: number;
  final_price: number;
  status: OrderStatus;
}
