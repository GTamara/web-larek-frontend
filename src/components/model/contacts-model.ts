import { IContacts, TPayment } from "../../types";
import { Model } from "../base/model";

interface IContactsModel {
	getAllUserData(): IContacts;
	clearAllUserData(): void;
}

type t = string & TPayment
export class ContactsModel extends Model<IContacts> implements IContactsModel {

	private _data: IContacts = {
		email: '',
		phone: '',
		address: '',
		payment: 'cash',	
	};
	formErrors: Partial<Record<keyof IContacts, string>> = {};

	set email (email: string) {
		this._data.email = email;
	}

	set phone (phone: string) {
		this._data.phone = phone;
	}

	set address (address: string) {
		this._data.address = address;
	}

	get payment (): TPayment {
		return this._data ? this._data.payment : undefined;
	}

	set payment (payment: TPayment) {
		this._data.payment = payment;
	}

	getAllUserData(): IContacts {
		return this._data;
	}

	clearAllUserData(): void {
		this._data = null;
	}

	saveField(field: keyof IContacts, value: string & TPayment) {
        this._data[field] = value;
    }

	validateOrder() {
        const errors: typeof this.formErrors = {};
		
		const addressRegExp = new RegExp(/^[а-яёА-ЯЁa-zA-Z0-9,\.\s_-]+$/);

		if (!addressRegExp.test(this._data.address)) {
			errors.address = 'Необходимо указать корректный адрес';
		}

        if (!this._data.address) {
            errors.address = 'Необходимо указать адрес';
        }

		if (!this._data.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
		}

        this.formErrors = errors;
        this.eventEmitter.emit('order:form-errors-change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

	validateContacts() {
        const errors: typeof this.formErrors = {};
		
		const emailRegExp = new RegExp(/^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\._-]+\.[a-zA-Z]{2,4}$/);
		const phoneRegExp = new RegExp(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/);

		if (!emailRegExp.test(this._data.email)) {
			errors.email = 'Необходимо указать корректный email';
		}

		if (!phoneRegExp.test(this._data.phone)) {
			errors.phone = 'Необходимо указать корректный телефон';
		}

        if (!this._data.email) {
            errors.email = 'Необходимо указать email';
        }

		if (!this._data.phone) {
            errors.address = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.eventEmitter.emit('contacts:form-errors-change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}