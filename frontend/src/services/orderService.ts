import api from './api';
import type { Order } from '../types';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/');
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export default orderService;
