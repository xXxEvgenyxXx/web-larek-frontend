import { Product } from "../types/index";

export class ProductFilter {
  static filterByCategory(products: Product[], category: string): Product[] {
    return products.filter(product => product.category === category);
  }

  static searchByName(products: Product[], query: string): Product[] {
    return products.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
  }

  static sortByPrice(products: Product[], ascending: boolean = true): Product[] {
    return products.sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
  }
}