import { CartItem } from "./CartItem";
import { Product } from "../types/index";
import { EventBroker } from "../components/base/events";

export class Cart {
  items: CartItem[] = [];

  constructor(private eventBroker: EventBroker) {}

  addItem(product: Product): void {
    const existingItem = this.items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.increaseQuantity();
    } else {
      this.items.push(new CartItem(product));
    }
    this.eventBroker.emit("cartUpdated", this.items);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.eventBroker.emit("cartUpdated", this.items);
  }

  clearCart(): void {
    this.items = [];
    this.eventBroker.emit("cartCleared");
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }
}