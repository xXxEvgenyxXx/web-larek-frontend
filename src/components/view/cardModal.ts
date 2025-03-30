import { Card } from "./card";
import { Actions, Product } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: Product): HTMLElement;
}

export class CardModal extends Card implements ICard {
  text: HTMLElement;
  button: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: Actions) {
    super(template, events, actions);
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
  }

  notSale(data:Product) {
    if(data.price) {
      return 'Купить'
    } else {
      this.button.setAttribute('disabled', 'true')
      return 'Не продается'
    }
  }

  render(data: Product): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.button.textContent = this.notSale(data);
    return this._cardElement;
  }
}