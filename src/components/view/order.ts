import {ensureAllElements, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";
import { Form } from "./form";

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export class OrderView extends Form<IOrderForm> {
	protected _submitButton: HTMLButtonElement;
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, protected eventEmitter: IEvents) {
		super(container, eventEmitter);
		this._submitButton = ensureElement<HTMLButtonElement>('.order__button', container);

		this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', (evt) => {
				const currentTargetName = (evt.currentTarget as HTMLButtonElement).name;
				this.setSelectedPaymentMethod(currentTargetName);
				this.eventEmitter.emit('order:payment-method-selected', {
					name: button.name
				});
            });
        });
	}

	set payment (value: string) {
		this.setSelectedPaymentMethod(value);
	}

	set selected(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    }

	render(data: any): HTMLFormElement {
		super.render(data);
		return this.container;
	}

	setSelectedPaymentMethod (selectedPayment: string) {
		this._buttons.forEach(btn => {
			this.toggleClass(
				btn, 
				'button_alt-active', 
				btn.name === selectedPayment
			);
		});
	}
}