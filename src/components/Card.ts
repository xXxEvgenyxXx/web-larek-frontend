import {Component} from "./base/Component";
import {IProduct} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    category: string;
    title: string;
    description?: string | string[];
    image: string;
    price:number;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price?: HTMLElement
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._description = container.querySelector(`.${blockName}__description`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`,container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`,container);
        this._button = container.querySelector(`#${blockName}-catalog .gallery__item`);
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

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value:string){
        this.setText(this._category, value);
    }
    get category(): string {
        return this._category.textContent || '';
    }

    set price(value:string){
        if(value===null){
            this.setText(this._price,`Бесценно`)
        }
        else{
            this.setText(this._price,`${value} синапсов`)
        }
    }

    get price():string{
        return this._price.textContent || '';
    }

    set description(value: string | string[]) {
        this.setText(this._description, value);
    }
}

export type CatalogItemStatus = {
    label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}