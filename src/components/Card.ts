import {Component} from "./base/Component";
import { ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    id: string;
    category?: string;
    title: string;
    description?: string;
    image?: string;
    price: number | null;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;
    private _currentIndex: number = 1;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`);
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
    set index(value: number) {
        this._currentIndex = value;
        if (this._index) {
            this._index.textContent = `${this._currentIndex}`;
            console.log(this._index.textContent)
        }
    }

    get index(): number {
        return this._currentIndex;
    }

    set description(value: string | string[]) {
        this.setText(this._description, value);
    }
    render(data?: Partial<ICard<T>> & { index?: number }): HTMLElement {
        if (data?.index !== undefined) {
            this.index = data.index;
        }
        return super.render(data);
    }
}

export type CatalogItemStatus = {
    label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }

    set buttonDisabled(value: boolean) {
        const button = this.container.querySelector('.card__button');
        if (button) {
            button.toggleAttribute('disabled', value);
        }
    }
}