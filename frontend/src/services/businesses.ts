import api from './api';
import type { Business, BusinessCreate, BusinessUpdate, Product } from '../types';

export const businessesService = {
  async list(filters?: { category?: string; tag?: string; search?: string; is_open?: boolean }): Promise<Business[]> {
    const response = await api.get('/businesses/', { params: filters });
    return response.data;
  },

  async create(data: BusinessCreate): Promise<Business> {
    const response = await api.post('/businesses/', data);
    return response.data;
  },

  async getMyBusiness(): Promise<Business> {
    const response = await api.get('/businesses/me');
    return response.data;
  },

  async getById(id: number): Promise<Business> {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },

  async update(id: number, data: BusinessUpdate): Promise<Business> {
    const response = await api.put(`/businesses/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/businesses/${id}`);
  },

  async listProducts(businessId: number): Promise<Product[]> {
    const response = await api.get(`/businesses/${businessId}/products`);
    return response.data;
  },

  async addTag(businessId: number, tag: string): Promise<Business> {
    const response = await api.post(`/businesses/${businessId}/tag`, null, { params: { tag } });
    return response.data;
  }
};
