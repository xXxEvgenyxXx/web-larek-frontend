import './scss/styles.scss';
import {CDN_URL, API_URL} from "./utils/constants";
import { LarekAPI } from './components/LarekAPI';
import {EventEmitter} from "./components/base/events";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { ensureElement,cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { CatalogItem } from './components/Card';
import { IProduct } from './types';
import { Modal } from './components/Modal';
const events = new EventEmitter();
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

events.on('items:changed', () => {
    console.log("Каталог обновлён:", appData.catalog); // Данные должны быть не пустые
});
events.on<CatalogChangeEvent>('items:changed', () => {
    const container = document.querySelector('.gallery')
    if (!container) return;

    container.innerHTML = ''; // Очищаем перед рендером

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
    const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
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
// Получение продуктов с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });