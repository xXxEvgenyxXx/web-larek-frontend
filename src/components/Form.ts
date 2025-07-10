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
    protected _paymentCard: HTMLElement;
    protected _paymentCash: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._paymentCard = container.querySelector('[name="card"]');
        this._paymentCash = container.querySelector('[name="cash"]');

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
        this._paymentCard.addEventListener('click',()=>{
            this.payment.type = 'online'
        })
        this._paymentCash.addEventListener('click',()=>{
            this.payment.type = 'cash'
        })
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

    set payment(value: PaymentMethod) {
        this.toggleClass(this._paymentCard, 'button_alt-active', value.type === 'online');
        this.toggleClass(this._paymentCash, 'button_alt-active', value.type === 'cash');
    }


    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}