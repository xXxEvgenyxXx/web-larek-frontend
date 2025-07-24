import './scss/styles.scss';
import {CDN_URL, API_URL} from "./utils/constants";
import { LarekAPI } from './components/LarekAPI';
//import {EventEmitter} from "./components/base/events";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { ensureElement,cloneTemplate,createElement } from './utils/utils';
import { Page } from './components/Page';
import { Card, CatalogItem } from './components/Card';
import { IProduct } from './types';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { events } from './components/base/events';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
console.log(order);

const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

events.onAll(({ eventName, data }) => {
    console.log('-------------------------------------------------');
    console.log(eventName, data);
})

events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment:'online',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// При отправке формы
events.on('order:submit', () => {
    const orderData = {
        payment: order.payment, // Используем геттер payment
        address: order.address // Используем геттер address
    };
    
    appData.setOrderData(orderData);
    
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});
// Обработка отправки формы контактов
events.on('contacts:submit', () => {
    const contactsData = {
        email: contacts.email,
        phone: contacts.phone
    };
    
    // Собираем все данные заказа
    const completeOrder = {
        ...appData.getOrderData(),
        ...contactsData
    };
    
    // Отправляем заказ
    events.emit('order:complete', completeOrder);
});
events.on('contacts:open', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});
events.on('items:changed', () => {
    console.log("Каталог обновлён:", appData.catalog); // Данные должны быть не пустые
});
events.on<CatalogChangeEvent>('items:changed', () => {

    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            category:item.category,
            title:item.title,
            image:item.image,
            description:item.description,
            price:item.price
        })
    });
});
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});
events.on('preview:changed', (item: IProduct) => {
    const card = new CatalogItem(cloneTemplate(cardPreviewTemplate),{
        onClick:()=>{
            appData.addToBasket(item);
        }
    });
    modal.render({
        content: card.render({
            category:item.category,
            title: item.title,
            image: item.image,
            price:item.price,
            description: item.description,
        })
    });
});
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});
events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map(id => {
    const item = appData.catalog.find(item => item.id === id);

    const card = new Card('card', cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        appData.removeFromBasket(item);
        basket.total = appData.basket.total;
      }
    })

    return card.render(item);
  })

  basket.total = appData.basket.total;
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
events.on('order:complete', () => {
    const successClone = cloneTemplate(successTemplate);
    const success = new Success(successClone, {
        onClick: () => modal.close()
    });

    success.setTotal(appData.basket.total);

    modal.render({
        content: success.render()
    });
});
// Получение продуктов с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });