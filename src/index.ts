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
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

events.onAll(({ eventName, data }) => {
    console.log('-------------------------------------------------');
    console.log(eventName, data);
})

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
events.on('card:addToBasket',(item:IProduct)=>{
})
// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
// Получение продуктов с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });