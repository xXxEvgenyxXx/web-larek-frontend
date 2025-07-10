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
    protected payment: PaymentMethod;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._paymentCard = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this._paymentCash = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this.payment = { type: 'online' }; // Значение по умолчанию

        // Инициализация активной кнопки
        this.togglePaymentButton(this.payment.type);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
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
        this.events.emit('payment:change', this.payment);
    }

    protected togglePaymentButton(type: 'online' | 'cash') {
        this.toggleClass(this._paymentCard, 'button_alt-active', type === 'online');
        this.toggleClass(this._paymentCash, 'button_alt-active', type === 'cash');
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}