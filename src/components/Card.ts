import {Component} from "./base/Component";
//import {IProduct} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";
//import { events } from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    id:string;
    category?: string;
    title: string;
    description?: string;
    image?: string;
    price:number | null;
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
        this._image = container.querySelector(`.${blockName}__image`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`,container);
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
    get description():string{
        return this._description.textContent || '';
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