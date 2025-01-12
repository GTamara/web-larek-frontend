import { IProduct } from "../../types";
import { Model } from "../base/model";

export interface IBasketModel {
	cardItems: Map<string, number>;
	addItem (id: string): void;
	removeItem (id: string): void;
	clearCard (): void;
	getTotal (items: Map<IProduct, number>): number;
}

export class BasketModel extends Model<Map<string, number>> implements IBasketModel {

	private _cardItems: Map<string, number> | null = new Map();

	selectedItem: IProduct | null = null;
	catalog: IProduct[];

	get cardItems () {
		return this._cardItems;
	}

	set cardItems (items: Map<string, number>) {
		this._cardItems = items;
	}

	addItem (id: string) {
		if (this.cardItems.has(id)) {
			this.cardItems.set(id, this.cardItems.get(id) + 1);
		} else {
			this.cardItems.set(id, 1);
		}
		this.emitChanges('basket:items-сhanged', this._cardItems);
	}

	removeItem (id: string) {
		if (this._cardItems.has(id)) {
			this._cardItems.delete(id);
			this.emitChanges('basket:items-сhanged', this._cardItems);
		}
	}

	clearCard () {
		this._cardItems.clear();
		this._cardItems = null;
		this.emitChanges('basket:items-сhanged', this._cardItems);
	}

	getTotal (): number {
		let total = 0;
		for (let [id, count] of this._cardItems) {
			const itemData = this.catalog.find(it => it.id === id);
			total += itemData.price * count;
		}
		return total;
    }

	getCardItemsIds () {debugger
		const result: string[] = [];
		for (let [id, count] of this._cardItems) {
			result.push(
				...Array(count).fill(id),
			);
		}
		return result;
	}

	setSelectedItem (item: IProduct) {
		this.selectedItem = item;
        this.emitChanges('card:open', { id: item.id });
	}

	setCatalog(items: IProduct[]) {
        this.catalog = items;
    }

	getCardProductsQuantity (id: string) {
		return this._cardItems.get(id) || 0;
	}
}