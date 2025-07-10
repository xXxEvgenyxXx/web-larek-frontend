import {Form} from "./Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";

export class Order extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}