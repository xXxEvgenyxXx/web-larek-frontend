import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/model/WebLarekApi';
import { DataModel } from './components/model/Data';
import { Card } from './components/view/card';
import { ensureElement } from './utils/utils';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const data = new DataModel(events);
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;


events.on('productCards:receive', () => {
    data.productCards.forEach(item => {
      const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
      ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
  });