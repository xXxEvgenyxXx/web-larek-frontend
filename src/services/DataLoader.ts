import { Api } from "../components/base/api";
import { EventBroker } from "../components/base/events";
import { AppState } from "../state/AppState";

export class DataLoader {
  constructor(private api: Api, private eventBroker: EventBroker, private appState: AppState) {}

  async loadProducts() {
    this.appState.setLoading(true);
    try {
      const products = await this.api.getProducts();
      this.eventBroker.emit("productsLoaded", products);
    } catch (error) {
      this.appState.setError("Ошибка загрузки товаров");
    }
    this.appState.setLoading(false);
  }
}