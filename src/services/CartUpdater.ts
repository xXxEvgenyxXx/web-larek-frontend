import { Cart } from "../models/Cart";

export class CartUpdater {
  constructor(private cart: Cart) {}

  updateQuantity(productId: string, quantity: number) {
    const item = this.cart.items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }
}