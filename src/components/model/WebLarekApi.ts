import { ApiListResponse, Api } from '../base/api';
import { OrderLot, OrderResult, Product } from '../../types';

export interface IWebLarekApi {
    cdn: string;
    items: Product[];
    getListProductCard: () => Promise<Product[]>;
    postOrderLot: (order: OrderLot) => Promise<OrderResult>;
  }
  
  export class WebLarekApi extends Api {
    cdn: string;
    items: Product[];
  
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
    }
  
    // получаем массив объектов(карточек) с сервера
    getListProductCard(): Promise<Product[]> {
      return this.get('/product').then((data: ApiListResponse<Product>) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image,
        }))
      );
    }
  
    // получаем ответ от сервера по сделанному заказу
    postOrderLot(order: OrderLot): Promise<OrderResult> {
      return this.post(`/order`, order).then((data: OrderResult) => data);
    }
  }