export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
<<<<<<< HEAD
<<<<<<< HEAD
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
      this.baseUrl = baseUrl;
      this.options = {
          headers: {
              'Content-Type': 'application/json',
              ...(options.headers as object ?? {})
          }
      };
  }

  protected handleResponse(response: Response): Promise<object> {
      if (response.ok) return response.json();
      else return response.json()
          .then(data => Promise.reject(data.error ?? response.statusText));
  }

  get(uri: string) {
      return fetch(this.baseUrl + uri, {
          ...this.options,
          method: 'GET'
      }).then(this.handleResponse);
  }

  post(uri: string, data: object, method: ApiPostMethods = 'POST') {
      return fetch(this.baseUrl + uri, {
          ...this.options,
          method,
          body: JSON.stringify(data)
      }).then(this.handleResponse);
  }
=======
>>>>>>> parent of 06fd625 (	modified:   src/components/base/api.ts)
  async getProducts(): Promise<Product[]> {
    return fetch('/api/products').then(res => res.json());
  }
=======
    readonly baseUrl: string;
    protected options: RequestInit;
>>>>>>> parent of 8c639ff (	modified:   src/components/base/api.ts)

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

<<<<<<< HEAD
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
=======
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
>>>>>>> parent of 8c639ff (	modified:   src/components/base/api.ts)
}
