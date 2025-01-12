import {ensureElement} from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export interface ISuccessView {
	total: number;
}

export class SuccessView extends Component<ISuccessView> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLFormElement, eventEmitter: IEvents) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
		this._total = ensureElement<HTMLButtonElement>('.order-success__description', container);
		this._closeButton.addEventListener('click', () => {
			eventEmitter.emit('success:close');
		});
	}

	set total (value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}