import { CartItem } from "./CartItem";

export interface OrderDetails {
  paymentMethod: "card" | "paypal";
  deliveryAddress: string;
  customerEmail: string;
  customerPhone: string;
}

export class Order {
  constructor(
    public id: string,
    public cart: CartItem[],
    public details: OrderDetails,
    public timestamp: string = new Date().toISOString()
  ) {}

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
  }

  validate(): string | null {
    if (!this.cart.length) return "Корзина пуста";
    if (!this.details.deliveryAddress) return "Введите адрес доставки";
    if (!this.details.customerEmail.includes("@")) return "Введите корректный email";
    if (!this.details.customerPhone.match(/^[0-9]{10}$/)) return "Введите корректный номер телефона";
    if (!["card", "paypal"].includes(this.details.paymentMethod)) return "Выберите корректный способ оплаты";
    return null;
  }
}
