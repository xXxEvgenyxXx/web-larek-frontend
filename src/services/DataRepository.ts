import { Product } from "../types/index";
import { Api } from "../components/base/api";

export class DataRepository {
  private static instance: DataRepository;
  private cache: Map<string, Product[]> = new Map();
  private api: Api;

  private constructor(api: Api) {
    this.api = api;
  }

  static getInstance(api: Api): DataRepository {
    if (!DataRepository.instance) {
      DataRepository.instance = new DataRepository(api);
    }
    return DataRepository.instance;
  }

  async getProducts(): Promise<Product[]> {
    if (this.cache.has("products")) {
      return this.cache.get("products")!;
    }
    const products = await this.api.getProducts();
    this.cache.set("products", products);
    return products;
  }
}