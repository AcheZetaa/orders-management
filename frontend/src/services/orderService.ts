import api from './api';
import type { Order, OrderCreate, OrderUpdate, OrderDetail, OrderItem, OrderItemCreate, OrderItemUpdate } from '../types';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/');
    return response.data;
  },
  getById: async (id: number): Promise<OrderDetail> => {
    const response = await api.get<OrderDetail>(`/orders/${id}`);
    return response.data;
  },
  create: async (data: OrderCreate): Promise<Order> => {
    const response = await api.post<Order>('/orders/', data);
    return response.data;
  },
  update: async (id: number, data: OrderUpdate): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
  addItem: async (orderId: number, data: OrderItemCreate): Promise<OrderItem> => {
    const response = await api.post<OrderItem>(`/orders/${orderId}/items`, data);
    return response.data;
  },
  updateItem: async (orderId: number, itemId: number, data: OrderItemUpdate): Promise<OrderItem> => {
    const response = await api.put<OrderItem>(`/orders/${orderId}/items/${itemId}`, data);
    return response.data;
  },
  removeItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}/items/${itemId}`);
  },
};

export default orderService;
