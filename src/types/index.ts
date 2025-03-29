export interface IProduct {
  id: string;
  title: string;
  category: string;
  price: number | null;
  description: string;
  image: string;
}
export interface IOrder {
  id: string;
  paymentMethod: 'card' | 'cash';
  deliveryAddress: string;
  customerEmail: string;
  customerPhone: string;
  timestamp: string;
    
  validateOrder(): string | null; // Проверяет корректность введённых данных
  createOrderToPost(items: string[], total: number): IOrderToPost;
}
export interface IOrderToPost {
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export interface Catalog {
  products: IProduct[];

  setProducts(products: IProduct[]): void; // Устанавливает список товаров после загрузки с сервера.
  getProducts(): IProduct[]; // Возвращает список товаров.
}
export interface IAppState {
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  currentView: 'catalog' | 'cart' | 'checkout';
}
export interface IOrderResult {
  id: string;
}