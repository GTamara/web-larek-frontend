import {createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
	actionDisabled: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected eventEmitter: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                eventEmitter.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set actionDisabled(total: number) {
        if (total && total > 0) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(sum: number) {
        this.setText(this._total, `${sum} синапсов`);
    }
}