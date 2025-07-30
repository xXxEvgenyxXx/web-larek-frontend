import { Component } from "./base/Component";
import { createElement, ensureElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement; // Изменено на HTMLButtonElement

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // Добавляем обработчик клика
        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });

        // Инициализируем пустой список
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста'
                })
            );
        }
        // Обновляем состояние кнопки
        this._button.disabled = items.length === 0;
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }
}