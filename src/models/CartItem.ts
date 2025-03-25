import { Product } from "../types/index";

export class CartItem {
  constructor(public product: Product, public quantity: number = 1) {}

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}