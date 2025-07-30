import './scss/styles.scss';
import { CDN_URL, API_URL } from "./utils/constants";
import { LarekAPI } from './components/LarekAPI';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { Card, CatalogItem } from './components/Card';
import { IProduct, IOrderForm, FormErrors } from './types';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { events } from './components/base/events';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Экземпляры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Логирование (для отладки)
events.onAll(({ eventName, data }) => {
    console.log('-------------------------------------------------');
    console.log(eventName, data);
});

// Открытие формы заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: 'online',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Отправка формы заказа
events.on('order:submit', () => {
    const orderData = {
        payment: order.payment,
        address: order.address
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

// Обработка ввода в полях контактов
events.on('form:field', (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Обработка ошибок и валидности
events.on('formErrors:change', (errors: FormErrors) => {
    const { email, phone } = errors;

    // Показываем ошибку только для email или телефона
    if (contacts) {
        const errorText = email || phone || '';
        contacts.errors = errorText;
        contacts.valid = !email && !phone;
    }
});

// Отправка формы контактов
events.on('contacts:submit', () => {
    if (appData.validateOrder()) {
        const completeOrder = {
            ...appData.getOrderData()
        };
        events.emit('order:complete', completeOrder);
    } else {
        // Ошибки уже показаны через formErrors:change
        console.log('Форма содержит ошибки');
    }
});

// Открытие формы контактов
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

// Обновление каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price
        });
    });
});

// Просмотр товара
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const isInBasket = appData.basket.items.includes(item.id);
    const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (!isInBasket) {
                appData.addToBasket(item);
                events.emit('basket:change');
                modal.close();
            }
        }
    });
    card.buttonDisabled = isInBasket;
    modal.render({
        content: card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price,
            description: item.description,
        })
    });
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

// Обновление корзины
events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.catalog.find(item => item.id === id);
        if (!item) return null;
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeFromBasket(item);
                events.emit('basket:change');
            }
        });
        return card.render({
            ...item,
            index: index + 1
        });
    }).filter(Boolean);
    basket.total = appData.basket.total;
});

// Блокировка прокрутки
events.on('modal:open', () => {
    page.locked = true;
});
events.on('modal:close', () => {
    page.locked = false;
});

// Завершение заказа
events.on('order:complete', () => {
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
            appData.resetOrder();
        }
    });
    success.setTotal(appData.basket.total);
    modal.render({
        content: success.render()
    });
});

// Загрузка данных
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error('Ошибка загрузки каталога:', err);
    });