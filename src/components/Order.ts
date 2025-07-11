import { Form } from "./Form";
import { PaymentMethod, IOrderForm, IFormState } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _paymentButtons: {
        online: HTMLButtonElement;
        cash: HTMLButtonElement;
    };
    protected _addressInput: HTMLInputElement;
    protected _currentPayment: PaymentMethod;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        // Инициализация элементов
        this._paymentButtons = {
            online: ensureElement<HTMLButtonElement>('button[name="card"]', container),
            cash: ensureElement<HTMLButtonElement>('button[name="cash"]', container)
        };

        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._currentPayment = 'online'; // Значение по умолчанию

        this._setupPaymentHandlers();
        this._setupAddressHandler();
        this._updatePaymentUI();
        this._validateForm(); // Первоначальная валидация
    }

    private _setupPaymentHandlers(): void {
        this._paymentButtons.online.addEventListener('click', () => {
            this._currentPayment = 'online';
            this._updatePaymentUI();
            this._validateForm();
        });

        this._paymentButtons.cash.addEventListener('click', () => {
            this._currentPayment = 'cash';
            this._updatePaymentUI();
            this._validateForm();
        });
    }

    private _setupAddressHandler(): void {
        this._addressInput.addEventListener('input', () => {
            this._validateForm();
        });
    }

    private _updatePaymentUI(): void {
        this.toggleClass(
            this._paymentButtons.online,
            'button_alt-active',
            this._currentPayment === 'online'
        );
        this.toggleClass(
            this._paymentButtons.cash,
            'button_alt-active',
            this._currentPayment === 'cash'
        );
    }

    private _validateForm(): void {
        const isPaymentSelected = !!this._currentPayment;
        const isAddressValid = this._addressInput.value.trim().length > 0;
        const isValid = isPaymentSelected && isAddressValid;
        
        this._submitButton.disabled = !isValid;
    }

    render(state: Partial<IOrderForm> & IFormState): HTMLFormElement {
        if (state.payment) {
            this._currentPayment = state.payment;
            this._updatePaymentUI();
        }
        
        if (state.address !== undefined) {
            this._addressInput.value = state.address;
        }
        
        this._validateForm(); // Валидация при рендере
        
        return this.container;
    }

    get payment(): PaymentMethod {
        return this._currentPayment;
    }

    get address(): string {
        return this._addressInput.value;
    }

    clear(): void {
        this._addressInput.value = '';
        this._currentPayment = 'online';
        this._updatePaymentUI();
        this._validateForm();
    }
}