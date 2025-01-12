import { IOrder, IProduct, IProductsListResponse, ISetNewOrderSuccessResponse } from '../../types';
import { Api } from '../base/api';

export class LarekApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductsList (): Promise<IProduct[]> {
		return this.get<IProductsListResponse>('/product').then(reponse => {
			return reponse.items.map(item => {
				return {
					...item,
					image: this.cdn + item.image
				};
			});
		});
	}

	getProductItem (id: string): Promise<IProduct> {
		return this.get<IProduct>(`/product/${id}`);
	}

	placeNewOrder (order: IOrder): Promise<ISetNewOrderSuccessResponse> {
		return this.post<IOrder, ISetNewOrderSuccessResponse>('/order', order);
	}

}
