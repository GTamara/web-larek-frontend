import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basket-model';
import { LarekApi } from './components/common/larek-api';
import { ContactsModel } from './components/model/contacts-model';
import './scss/styles.scss';
import { IContacts, IProduct, ISetNewOrderSuccessResponse, TPayment } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { PageView } from './components/view/page';
import { ProductView } from './components/view/product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/view/basket';
import { Modal } from './components/view/modal';
import { ContactsView, IContactsForm } from './components/view/contacts';
import { IOrderForm, OrderView } from './components/view/order';
import { SuccessView } from './components/view/success';

const eventEmitter = new EventEmitter();
const larekApi = new LarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
eventEmitter.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Все шаблоны 
 const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
 const itemPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
 const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
 const basketProductItem = document.querySelector('#card-basket') as HTMLTemplateElement;
 const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
 const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
 const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Глобальные контейнеры
const page = new PageView(document.body, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const basket = new Basket(cloneTemplate(basketTemplate), eventEmitter);

// Модель данных приложения
const contactsState = new ContactsModel({} as IContacts, eventEmitter);
const basketState = new BasketModel(null, eventEmitter);

// Views
const orderView = new OrderView(cloneTemplate(orderTemplate), eventEmitter);
const contactsView = new ContactsView(cloneTemplate(contactsTemplate), eventEmitter);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Блокируем прокрутку страницы если открыта модалка
eventEmitter.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
eventEmitter.on('modal:close', () => {
    page.locked = false;
});

larekApi
	.getProductsList()
	.then((productItems) => {
		basketState.setCatalog(productItems);
		page.catalog = productItems.map(itemData => {
			const card = new ProductView(cloneTemplate(catalogItemTemplate), {
				onClick: () => eventEmitter.emit('card:select', itemData)
			});
			
			return card.render({
				title: itemData.title,
				image: itemData.image,
				description: itemData.description,
				category: itemData.category,
				price: itemData.price,
			});
		});
	})
	.catch((err: string) => console.error(`Error: `, err));
	
// Назначить карточку товара выбранной
eventEmitter.on('card:select', (item: IProduct) => {
    basketState.setSelectedItem(item);
});

// Показать выбранную карточку товара
eventEmitter.on('card:open', (item: IProduct) => {
	const card = new ProductView(
		cloneTemplate(itemPreviewTemplate),
		{
			onClick: () => {
				basketState.addItem(item.id);
				card.actionTitle = getActionTitle(item.id);
			}
		}
	);

	larekApi.getProductItem(item.id)
		.then(itemData => {			
			const productQuantity: number = basketState.getCardProductsQuantity(item.id) || 0;
			modal.render({
				content: card.render({
					title: itemData.title,
					image: CDN_URL + itemData.image,
					description: itemData.description,
					category: itemData.category,
					price: (productQuantity ? itemData.price * productQuantity : itemData.price),
					actionTitle: getActionTitle(item.id),
				}),
			});
		})
		.catch((err: string) => console.error(`Error: `, err));
	
});

// вспомогательная функция для вычисления названия кнопки.
function getActionTitle (id: string) {
	const inCardProductQuantity = basketState.getCardProductsQuantity(id);
	return inCardProductQuantity > 0 ? `В корзине (${inCardProductQuantity})` : 'В корзину';
}

// обработчик события изменения количества товаров в корзине
eventEmitter.on<Map<string, number>>('basket:items-сhanged', (cardItems: Map<string, number>) => {
    page.counter = cardItems.size;
});

// Открыть карзину
eventEmitter.on('basket:open', () => {
	    modal.render({
        content: getBasketContent(basketState),
    });
});

eventEmitter.on('basket:content-сhanged', () => {
	modal.render({
		content: getBasketContent(basketState)
	});
});

function getBasketContent (basketState: BasketModel): HTMLElement {
	return basket.render({
		total: basketState.getTotal(),
		actionDisabled: basketState.getTotal(),
		items: Array.from(basketState.cardItems.entries())
			.map(item => {
				const itemData = basketState.catalog.find(it => it.id === item[0]);

				const card = new ProductView(
					cloneTemplate(basketProductItem),
					{
						onClick: () => {
							basketState.removeItem(item[0]);
							eventEmitter.emit('basket:content-сhanged', basketState.cardItems)
						}
					}
				);
				return card.render({
					id: item[0],
					quantity: item[1],
					...itemData,
				});
			}),
	});
}

eventEmitter.on('order:open', () => {
	modal.render({
		content: orderView.render({
			payment: contactsState.payment,
		}),
	});
})

eventEmitter.on('order:payment-method-selected', (data: {name: TPayment}) => {
	contactsState.payment = data.name;
})

eventEmitter.on('order:form-errors-change', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    orderView.valid = !address && !payment;
	address ? orderView.setValidField('address', false) : orderView.setValidField('address', true);
    orderView.errors = Object.values({ address, payment }).filter(i => !!i).join(`; \n`);
});

// Изменилось одно из полей
eventEmitter.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string & TPayment }) => {
    contactsState.saveField(data.field, data.value);
	contactsState.validateOrder();
});

eventEmitter.on('order:submit', () => {	
	modal.render({
		content: contactsView.render({
			email: contactsState.email,
			phone: contactsState.phone,
		}),
	});
});

eventEmitter.on('contacts:form-errors-change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contactsView.valid = !email && !phone;
	email ? contactsView.setValidField('email', false) : contactsView.setValidField('email', true);
	phone ? contactsView.setValidField('phone', false) : contactsView.setValidField('phone', true);
    contactsView.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
eventEmitter.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string & TPayment }) => {
    contactsState.saveField(data.field, data.value);
	contactsState.validateContacts();
});

eventEmitter.on('contacts:submit', () => {
	const userData: IContacts = contactsState.getAllUserData();
	const orderData: string[] = Array.from(
		basketState.cardItems.keys()
	);
	const orderPayload = {
		...userData,
		items: orderData,
		total: basketState.getTotal(),
	};

	larekApi
		.placeNewOrder(orderPayload)
		.then((response: ISetNewOrderSuccessResponse) => {
			const successView = new SuccessView(cloneTemplate(successTemplate), eventEmitter);
			modal.render({
				content: successView.render({
					total: response.total,
				}),
			});
		})
		.catch((err) => {
			const r = typeof(err)
			console.error(`Не удалось оформить заказ. Попробуйте позднее. Error: ${err}`)
		});
	
});

eventEmitter.on('success:close', () => {
	modal.close();
});