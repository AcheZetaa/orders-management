import api from './api';
import type { Order, OrderCreate, OrderUpdate } from '../types';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/');
    return response.data;
  },
  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
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
};

export default orderService;
