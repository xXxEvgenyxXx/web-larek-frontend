//import _ from "lodash";
//import {dayjs, formatNumber} from "../utils/utils";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IProduct, IOrder, IOrderForm,IBasket,PaymentMethod} from "../types";

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
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};
    items: IProduct[] = [];

    /**
     * Сохраняет данные заказа (адрес и способ оплаты)
     */
    setOrderData(data: { payment: PaymentMethod; address: string }): void {
        if (!data.payment || !data.payment) {
            throw new Error('Payment method is required');
        }
        
        this.order = {
            ...this.order,
            payment: data.payment,
            address: data.address
        };
        this.emitChanges('order:updated', this.order);
    }

    /**
     * Получает текущие данные заказа
     */
    getOrderData(): IOrder {
        return {
            ...this.order,
            items: [...this.basket.items]
        };
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

    getTotal(): number {
        return this.basket.items.reduce((total, itemId) => {
            const item = this.catalog.find(it => it.id === itemId);
            return total + (item?.price || 0);
        }, 0);
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

        if (this.validateOrder()) {
            this.emitChanges('order:ready', this.order);
        }
    }

    setPreview(item: IProduct): void {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateOrder(): boolean {
        const errors: typeof this.formErrors = {};
        
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (this.order.payment && !this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        
        this.formErrors = errors;
        this.emitChanges('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    resetOrder(): void {
        this.order = {
            email: '',
            phone: '',
            items: []
        };
        this.basket = {
            items: [],
            total: 0
        };
        this.emitChanges('order:reset');
    }
}