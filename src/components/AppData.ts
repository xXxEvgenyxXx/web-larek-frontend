//import _ from "lodash";
//import {dayjs, formatNumber} from "../utils/utils";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IProduct, IOrder, IOrderForm} from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {
    basket: IProduct[] = [];
    catalog: IProduct[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    addToBasket(item: IProduct) {
        this.basket.push(item);
        console.log('Basket elements:');
        this.basket.forEach(basketElement => {
            console.log(basketElement)
        });
        console.log(this.basket.length);
        this.events.emit('card:addToBasket',item) // дописать реализацию ивента change (изменение корзины) в твоем стиле
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }
    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}