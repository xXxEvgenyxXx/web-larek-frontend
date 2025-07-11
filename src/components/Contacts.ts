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

        this._setupValidation();
    }

    private _setupValidation(): void {
        const validate = () => {
            const emailValid = this._validateEmail(this._emailInput.value);
            const phoneValid = this._validatePhone(this._phoneInput.value);
            
            if (!emailValid) {
                this.errors = 'Введите корректный email';
            } else if (!phoneValid) {
                this.errors = 'Введите корректный телефон';
            } else {
                this.errors = '';
            }
            
            this.valid = emailValid && phoneValid;
        };
        
        this._emailInput.addEventListener('input', validate);
        this._phoneInput.addEventListener('input', validate);
    }

    private _validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private _validatePhone(phone: string): boolean {
        return phone.length >= 10; // Минимальная длина номера
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}