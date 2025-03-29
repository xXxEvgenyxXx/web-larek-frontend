import { Cart } from "../models/Cart";
import { Order, OrderDetails } from "../models/Order";
import { EventBroker } from "../components/base/events";
import { Api } from "../components/base/api";
import { Product } from "../types/index";

export class Presenter {
  constructor(private cart: Cart, private api: Api, private eventBroker: EventBroker) {}

  init() {
    this.eventBroker.on("addToCart", (product: Product) => this.cart.addItem(product));
    this.eventBroker.on("removeFromCart", (productId: string) => this.cart.removeItem(productId));
    this.eventBroker.on("checkout", (details: OrderDetails) => this.processOrder(details));
  }

  async processOrder(details: OrderDetails) {
    const validItems = [];
    for (const item of this.cart.items) {
      const product = await this.api.getProductById(item.product.id);
      if (product) {
        validItems.push(item);
      } else {
        this.eventBroker.emit("orderError", `Товар ${item.product.title} больше недоступен`);
      }
    }

    if (validItems.length === 0) {
      this.eventBroker.emit("orderError", "Все товары недоступны, заказ невозможен.");
      return;
    }

    const total:any = validItems.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
    const order = new Order(Date.now().toString(), validItems, details, total);

    try {
      const response = await this.api.createOrder(order);
      if (response.success) {
        this.cart.clearCart();
        this.eventBroker.emit("orderSuccess", order);
      } else {
        this.eventBroker.emit("orderError", "Ошибка при создании заказа");
      }
    } catch (error) {
      this.eventBroker.emit("orderError", "Ошибка сети");
    }
  }
}