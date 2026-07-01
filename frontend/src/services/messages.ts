import api from './api';
import type { Message, MessageCreate } from '../types';

export const messagesService = {
  async send(data: MessageCreate): Promise<Message> {
    const response = await api.post('/messages/', data);
    return response.data;
  },

  async getInbox(unreadOnly?: boolean): Promise<Message[]> {
    const response = await api.get('/messages/inbox', { params: { unread_only: unreadOnly } });
    return response.data;
  },

  async getSent(): Promise<Message[]> {
    const response = await api.get('/messages/sent');
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/messages/unread-count');
    return response.data;
  },

  async markAsRead(id: number): Promise<Message> {
    const response = await api.patch(`/messages/${id}/read`);
    return response.data;
  }
};
