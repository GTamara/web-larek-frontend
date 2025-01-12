import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";
import { Form } from "./form";

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsView extends Form<IContactsForm> {
	protected _submitButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', container);
	}

	set phone (value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value || '';
	}

	set email (value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value || '';
	}

	render(data: any): HTMLFormElement {
		super.render(data);
		return this.container;
	}
}