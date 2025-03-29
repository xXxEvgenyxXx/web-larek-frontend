import { Api, ApiListResponse } from "./base/api";
import { IProduct } from "../types";
import {CDN_URL, API_URL} from '../utils/constants'
export interface IWebLarekApi {
    getCards: () => Promise<IProduct[]>;
  }
  
  export class WebLarekApi extends Api implements IWebLarekApi {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
    }
  
    getCards(): Promise<IProduct[]> {
      return this.get('/product').then((data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
      );
    }
  }