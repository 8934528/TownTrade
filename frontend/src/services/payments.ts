import api from './api';
import type { Payment, PaymentCreate } from '../types';

export const paymentsService = {
  async initiate(data: PaymentCreate): Promise<Payment> {
    const response = await api.post('/payments/', data);
    return response.data;
  },

  async listMyPayments(): Promise<Payment[]> {
    const response = await api.get('/payments/my');
    return response.data;
  },

  async getById(id: number): Promise<Payment> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async confirm(reference: string): Promise<Payment> {
    const response = await api.post(`/payments/confirm/${reference}`);
    return response.data;
  }
};
