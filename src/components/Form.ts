import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "./../utils/utils";
import { PaymentMethod } from "../types";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected payment: PaymentMethod;
    protected _isValid: boolean = false; // Внутреннее состояние валидности

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._paymentCard = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this._paymentCash = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        this.payment = { type: 'online' }; // Значение по умолчанию

        // Инициализация
        this.togglePaymentButton(this.payment.type);
        this.updateSubmitButton();

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
            this.validateForm();
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.isFormValid()) {
                this.events.emit(`${this.container.name}:submit`);
            }
        });

        this._paymentCard.addEventListener('click', () => {
            this.setPayment('online');
        });

        this._paymentCash.addEventListener('click', () => {
            this.setPayment('cash');
        });
    }

    protected setPayment(type: 'online' | 'cash') {
        this.payment = { type };
        this.togglePaymentButton(type);
        this.validateForm();
        this.events.emit('payment:change', this.payment);
    }

    protected togglePaymentButton(type: 'online' | 'cash') {
        this.toggleClass(this._paymentCard, 'button_alt-active', type === 'online');
        this.toggleClass(this._paymentCash, 'button_alt-active', type === 'cash');
    }

    protected validateForm() {
        const isAddressValid = this._addressInput.value.trim().length > 0;
        const isPaymentSelected = !!this.payment.type;
        
        this.valid = isAddressValid && isPaymentSelected;
    }

    protected isFormValid(): boolean {
        return this._isValid;
    }

    protected updateSubmitButton() {
        this._submit.disabled = !this._isValid;
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        if (this._isValid !== value) {
            this._isValid = value;
            this.updateSubmitButton();
        }
    }

    get valid(): boolean {
        return this._isValid;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        if (valid !== undefined) {
            this.valid = valid;
        }
        if (errors) {
            this.errors = errors.join(', ');
        }
        Object.assign(this, inputs);
        this.validateForm();
        return this.container;
    }
}