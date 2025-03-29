export interface Product {
  id: string;
  title: string;
  category: string;
  price: number | null;
  description: string;
  image: string;
}

export interface Actions {
  onClick: (event: MouseEvent) => void;
}

export interface OrderForm {
  payment: string;
  address: string;
  phone: string;
  email: string;
  total: string | number;
}

export interface Order extends OrderForm {
  items: string[];
}

export interface OrderLot{
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface OrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof Order, string>>;