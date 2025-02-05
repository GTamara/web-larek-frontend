export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}

export interface IProductView extends IProduct {
	actionTitle: string;
	quantity: number;
	index: number
}

export type TCategory = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';

export interface IBasket {
	items: Map<string, number>
}

export type TPayment = 'card' | 'cash' | undefined;

export interface IContacts {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}

export type IOrder = IContacts & {
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

export interface IProductsListResponse {
	total: number;
	items: IProduct[];
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}
