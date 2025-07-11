
//Готовый
export interface IProduct { 
  id: string;
  title: string;
  category: string;
  price: number | null;
  description: string;
  image: string;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
export interface IOrder {
    email: string;
    phone: string;
    items: string[];
    payment?: 'online' | 'cash'; // Добавляем необязательное поле
    address?: string;            // Добавляем необязательное поле
}
export interface IFormState {
    valid: boolean;
    errors: string[];
}
export interface IOrderForm {
    email: string;
    phone: string;
    payment: 'online' | 'cash';
    address: string;
}

export type PaymentMethod = 'online' | 'cash';
export interface IBasket {
    items: string[];
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBid {
    price: number
}
export interface IOrderResult {
    id: string;
}