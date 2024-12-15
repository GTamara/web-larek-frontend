export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number;
}

export type TPayment = 'online' | 'offline' | undefined;
export type TCategory = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';

export interface IBasket {
	items: Map<string, number>
}

export interface IContacts {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}

export interface IOrder extends IContacts {
 	total: number;
	items: string[];
}

export interface ISetNewOrderSuccessResponse {
	id: string;
	total: number;
}

export interface IErrorResponce {
	error: string;
}

export type TSetNewOrderResponce = ISetNewOrderSuccessResponse | IErrorResponce;

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

export enum EOrderProcessingModals {
	product = 'modal:product',
	basket = 'modal:basket',
	paymentMethod = 'modal:paymentMethod',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}