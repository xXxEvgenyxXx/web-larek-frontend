import {Order} from '../../models/Order';
import { Product } from '../../types';
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  async getProducts(): Promise<Product[]> {
    return fetch('/api/products').then(res => res.json());
  }

  async getProductById(id: string): Promise<Product | null> {
    return fetch(`/api/products/${id}`)
      .then(res => (res.status === 200 ? res.json() : null));
  }

  async createOrder(order: Order): Promise<{ success: boolean; id?: string }> {
    return fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).then(res => res.json());
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return fetch(`/api/order/${orderId}`)
      .then(res => (res.status === 200 ? res.json() : null));
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean }> {
    return fetch(`/api/order/${orderId}`, {
      method: 'DELETE'
    }).then(res => res.json());
  }
}
