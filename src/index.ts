import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/model/WebLarekApi';
import { DataModel } from './components/model/Data';
import { Card } from './components/view/card';
import { ensureElement } from './utils/utils';
import { Product } from './types/index';
import { Modal } from './components/view/modal';
import { CardModal } from './components/view/cardModal';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const cardData = new DataModel(events);
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;


events.on('productCards:receive', () => {
  cardData.productCards.forEach(item => {
      const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
      ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
  });

events.on('card:select', (item: Product) => { cardData.setPreview(item) });

events.on('modalCard:open', (item: Product) => {
  const cardPreview = new CardModal(cardModalTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

api.getListProductCard()
.then((data: Product[]) =>{
  cardData.productCards = data;
})
.catch(error => console.log(error))