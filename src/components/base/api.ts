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
}
export class ApiClient {
  async getProducts(): Promise<Product[]> {
    return fetch('/api/products').then(res => res.json());
  }

  async getProductById(id: string): Promise<Product> {
    return fetch(`/api/products/${id}`).then(res => res.json());
  }
  async createOrder(order: Order): Promise<{ success: boolean }> {
    return fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).then(res => res.json());
  }
}
