import api from './api';
import type { Product, ProductCreate, ProductUpdate } from '../types';

export const productsService = {
  async listAll(filters?: { category?: string; search?: string }): Promise<Product[]> {
    const response = await api.get('/products/', { params: filters });
    return response.data;
  },

  async create(data: ProductCreate): Promise<Product> {
    const response = await api.post('/products/', data);
    return response.data;
  },

  async getLowStock(): Promise<Product[]> {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async update(id: number, data: ProductUpdate): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateStock(id: number, delta: number): Promise<Product> {
    const response = await api.patch(`/products/${id}/stock`, null, { params: { delta } });
    return response.data;
  }
};
