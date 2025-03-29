export interface Product {
    id: string;
    title: string;
    category: string;
    price: number | null;
    description: string;
    image: string;
  }
  export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
    status?: boolean;
    selected?: boolean;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
}