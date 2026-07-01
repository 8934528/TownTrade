import api from './api';
import type { Order, OrderCreate, TrackingInfo } from '../types';

export const ordersService = {
  async create(data: OrderCreate): Promise<Order> {
    const response = await api.post('/orders/', data);
    return response.data;
  },

  async listMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my');
    return response.data;
  },

  async listBusinessOrders(status?: string): Promise<Order[]> {
    const response = await api.get('/orders/business', { params: { status } });
    return response.data;
  },

  async track(trackingCode: string): Promise<TrackingInfo> {
    const response = await api.get(`/orders/track/${trackingCode}`);
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: number, status: string): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, null, { params: { new_status: status } });
    return response.data;
  },

  async cancel(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  }
};
