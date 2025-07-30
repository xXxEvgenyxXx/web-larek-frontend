import { Form } from "./Form";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IContactsForm {
    email: string;
    phone: string;
}

export class Contacts extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        // Передаём ввод в модель
        this._emailInput.addEventListener('input', () => {
            this.events.emit('form:field', { field: 'email', value: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('form:field', { field: 'phone', value: this._phoneInput.value });
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    // Ошибки и валидность управляются извне (из AppState)
    set errors(value: string) {
        super.errors = value;
    }

    set valid(value: boolean) {
        super.valid = value;
    }
}