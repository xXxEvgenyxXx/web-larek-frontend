import { Product } from "../../types";
import { IEvents } from "../base/events";

export interface IDataModel {
  productCards: Product[];
  selectedСard: Product;
  setPreview(item: Product): void;
}

export class DataModel implements IDataModel {
  protected _productCards: Product[];
  selectedСard: Product;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: Product[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: Product) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}