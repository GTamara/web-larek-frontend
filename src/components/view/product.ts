import { IActions, IProductView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

export class ProductView extends Component<IProductView> {
    protected _id: string;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLSpanElement;
    protected _category?: HTMLSpanElement;
	protected _quantity?: HTMLSpanElement;

    constructor(protected container: HTMLElement, actions?: IActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);

        this._image = container.querySelector<HTMLImageElement>(`.card__image`);
        this._button = container.querySelector<HTMLButtonElement>(`.card__button`);
        this._description = container.querySelector(`.card__description`);
        this._category = container.querySelector(`.card__category`);
		this._quantity = container.querySelector(`.card__quantity`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description (value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

	set price (value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
	}

	set category (value: string) {
		this.setText(this._category, value);
		let category: string;

		switch (value) {
			case 'хард-скилл':
				category = 'hard';
				break;
			case 'софт-скилл':
				category = 'soft';
				break;
			case 'другое':
				category = 'other';
				break;
			case 'кнопка':
				category = 'button';
				break;
			case 'дополнительное':
				category = 'additional';
				break;
			default:
				category = 'other';
		}
		this._category &&this._category.classList.add(`card__category_${category}`);
	}

	set actionTitle (value: string) {
		this.setText(this._button, value);
	}

	set quantity (value: number) {
		this.setText(this._quantity, `( ${value} ) шт.`);
	}

}