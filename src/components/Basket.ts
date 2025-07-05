import { Component } from "./base/Component";
import {createElement, ensureElement, formatNumber} from "./../utils/utils";
import { EventEmitter } from "./base/events";
import { IProduct } from "../types";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
        console.log(this.items);
    }

    set items(items: HTMLElement[]) {
        let counter = 1;
        items.forEach(item => {
            console.log(`item ${counter}:`)
            console.log(item);
            item.querySelector('.basket__item-index').textContent = `${counter}`
            counter+=1;
        });
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    //set selected(items: string[]) {
    //    if (items.length) {
    //        this.setDisabled(this._button, false);
    //    } else {
    //        this.setDisabled(this._button, true);
    //    }
    //}

    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }
}