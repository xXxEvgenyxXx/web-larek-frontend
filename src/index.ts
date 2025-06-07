import './scss/styles.scss';
import {CDN_URL, API_URL} from "./utils/constants";
import { AuctionAPI } from './components/AuctionAPI';
import {EventEmitter} from "./components/base/events";
import { AppState } from './components/AppData';
import { ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

console.log(cardCatalogTemplate);

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

// Получение продуктов с сервера
api.getProductList()
    .then(data => {
        console.log('Полученные данные:', data); 
        return data; 
    })
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });