import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/model/WebLarekApi';
import { DataModel } from './components/model/DataModel';
import { Card } from './components/view/card';
import { ensureElement } from './utils/utils';
import { Product, OrderForm } from './types/index';
import { Modal } from './components/view/modal';
import { CardModal } from './components/view/cardModal';
import { BasketModel } from './components/model/BasketModel';
import { Basket } from './components/view/basket';
import { BasketItem } from './components/view/basketItem';
import { Order } from './components/view/formOrder';
import { FormModel } from './components/model/FormModel';
import { Contacts } from './components/view/formContacts';
import { Success } from './components/view/success';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const cardData = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketModel = new BasketModel();
const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const formModel = new FormModel(events);
const contacts = new Contacts(contactsTemplate, events);


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

events.on('card:addBasket', () => {
  basketModel.setSelectedСard(cardData.selectedСard);
  basket.renderHeaderBasketCounter(basketModel.getCounter()); 
  modal.close();
});

events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());  // отобразить сумма всех продуктов в корзине
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i++;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name })

events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

events.on('formErrors:address', (errors: Partial<OrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();
  modal.content = contacts.render();
  modal.render();
});

events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

events.on('success:open', () => {
  api.postOrderLot(formModel.getOrderLot())
    .then((data) => {
      console.log(data); // ответ сервера
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts(); // очищаем корзину
      basket.renderHeaderBasketCounter(basketModel.getCounter()); // отобразить количество товара на иконке корзины
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('modal:open', () => {
  modal.locked = true;
});

events.on('modal:close', () => {
  modal.locked = false;
});

api.getListProductCard()
.then((data: Product[]) =>{
  cardData.productCards = data;
})
.catch(error => console.log(error))