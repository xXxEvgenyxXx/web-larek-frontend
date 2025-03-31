import { Product } from "../../types";

export interface IBasketModel {
  basketProducts: Product[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: Product): void;
  deleteCardToBasket(item: Product): void;
  clearBasketProducts(): void
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: Product[]; // список карточек товара в корзине

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: Product[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // количество товара в корзине
  getCounter() {
    return this.basketProducts.length;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  setSelectedСard(data: Product) {
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  deleteCardToBasket(item: Product) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  clearBasketProducts() {
    this.basketProducts = []
  }
}