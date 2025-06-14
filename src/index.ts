import './scss/styles.scss';
import {CDN_URL, API_URL} from "./utils/constants";
import { LarekAPI } from './components/LarekAPI';
import {EventEmitter} from "./components/base/events";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { ensureElement,cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { CatalogItem } from './components/Card';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
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
    console.log(container);

    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        console.log(item);
        return card.render({
            category:item.category,
            title:item.title,
            image:item.image,
            description:item.description,
            price:item.price
        })
        
        //const cardHtml = card.render({
        //    title: item.title,
        //    image: item.image,
        //    description: item.description,
        //});
        //
        //container.appendChild(cardHtml); // Вставляем в DOM
    });
});
// Получение продуктов с сервера
const container:HTMLElement = document.querySelector('.gallery');
console.log(container);
console.log('-----------------------------------------');
api.getProductList()
    .then(data => {
        console.log(data);
        data.forEach(cardData => {
            const card = new CatalogItem(cloneTemplate(cardCatalogTemplate));
            console.log('-----------------------------------------');
            console.log(card);
            console.log(`${cardData.id}`);
            let cardHTML = card.render({
                category:cardData.category,
                title:cardData.title,
                image:cardData.image,
                description:cardData.description,
                price:cardData.price
            })
            container.appendChild(cardHTML);
        });
        return data; 
    })
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });