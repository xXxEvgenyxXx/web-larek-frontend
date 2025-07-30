import { Model } from "./base/Model";
import { FormErrors, IAppState, IProduct, IOrder, IOrderForm, IBasket, PaymentMethod } from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {
    basket: IBasket = {
        items: [],
        total: 0
    };
    catalog: IProduct[];
    loading: boolean;
    order: IOrder = {
        payment: 'online', // добавлено по умолчанию
        address: '',
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setOrderData(data: { payment: PaymentMethod; address: string }): void {
        this.order = {
            ...this.order,
            payment: data.payment,
            address: data.address
        };
        this.emitChanges('order:updated', this.order);
    }

    getOrderData(): IOrder {
        return {
            ...this.order,
            items: [...this.basket.items]
        };
    }

    isInBasket(id: string): boolean {
        return this.basket.items.includes(id);
    }

    addToBasket(item: IProduct): void {
        this.basket.items.push(item.id);
        this.basket.total += item.price;
        this.emitChanges('basket:change', this.basket);
    }

    removeFromBasket(item: IProduct): void {
        this.basket.items = this.basket.items.filter(id => id !== item.id);
        this.basket.total -= item.price;
        this.emitChanges('basket:change', this.basket);
    }

    setCatalog(items: IProduct[]): void {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setOrderField(field: keyof IOrderForm, value: string): void {
        if (field === 'payment') {
            this.order.payment = value as 'online' | 'cash';
        } else if (field === 'address') {
            this.order.address = value;
        } else {
            this.order[field] = value;
        }
        this.validateOrder();
    }

    setPreview(item: IProduct): void {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateOrder(): boolean {
        const errors: typeof this.formErrors = {};

        // Валидация email
        if (!this.order.email) {
            errors.email = 'Введите корректный email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)) {
            errors.email = 'Введите корректный email';
        }

        // Валидация телефона
        if (!this.order.phone) {
            errors.phone = 'Введите корректный телефон';
        } else if (!/^[\d\-\+\(\)\s]+$/.test(this.order.phone)) {
            errors.phone = 'Введите корректный телефон';
        } else if (this.order.phone.replace(/\D/g, '').length < 10) {
            errors.phone = 'Введите корректный телефон';
        }

        // Валидация адреса
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        this.formErrors = errors;
        this.emitChanges('formErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    resetOrder(): void {
        this.order = {
            payment: 'online',
            address: '',
            email: '',
            phone: '',
            items: []
        };
        this.basket = {
            items: [],
            total: 0
        };
        this.formErrors = {};
        this.emitChanges('order:reset');
    }
}