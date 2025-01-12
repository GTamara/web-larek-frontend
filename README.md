# Проектная работа "Веб-ларек"

[Ссылка на репозиторий](https://github.com/GTamara/web-larek-frontend)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация

Архитектура проекта разработана с использованием паттерна MVP, в котором основыми слоями являются:
- модели данных, которые отвечают за работу с данными
- представления, которые отвечают за отображение данных на экране
- презентер. Код презентера не будет выделен в отдельный класс, так как приложение состоит только из одной страницы - каталога товаров. Презентер содержится в основном скрипте index.ts

---
### class EventEmitter
Имплементирует интерфейс 
```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
* `on` — для подписки на событие  
* `off` — для  отписки от события 
* `emit` — и уведомления подписчиков о наступлении события соответственно.
* `onAll` и  `offAll`  — для подписки на все события и сброса всех подписчиков.
* `trigger` , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса  `EventEmitter` .

---

### class LarekApi 
Наследует базовый класс `Api`
Класс предназначен для взаимодействия с сервером

* getProductList (): Promise<IProduct[]>
* getProductItem (id: string): Promise<IProduct>
* placeNewOrder (order: IOrder): Promise<ISetNewOrderSuccessResponse>

---

## Модели данных

### class BasketModel 
Имплементирует интерфейс `IBasketModel`

```
export interface IBasketModel {
	cardItems: Map<string, number>;
	addItem (id: string): void;
	removeItem (id: string): void;
	clearCard (): void;
	getTotal (items: Map<IProduct, number>): number;
}
```

Класс предназначен для управления списком покупок. 
Список покупок будет храниться в `cardItems`.

* addItem (id: string): void - добавление товара в корзину
* removeItem (id: string): void - удаление товара из корзины
* clearCard (): void - очистить корзину после того, как заказ был усмешно создан;
* getTotal (items: Map<IProduct, number>): number; - вычислить стоимость товаров в корзине
---

### class ContactsModel
Имплементирет интерфейс `IContacts`
```
export interface IContacts {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}
```
Класс предназначен для управления данными покупателя. При инициализации класса поля принимают значение 
```
{
	email: '',
	phone: '',
	address: '',
	payment: 'cash',	
}
 ```
* set email - записать почту пользователя
* set phone - записать телефон пользователя
* set address - записать адрес пользователя
* set / get payment - записать / прочитать способ оплаты пользователя

* getAllUserData (): IContacts - получить текущие данные покупателя
* clearAllUserData(): void - очистить данные покупателя
* saveField () - вспомогательная функция для сохранения полей данных покупателя
* validateOrder() - валидация полей и всей формы #order
* validateContacts() - валидация полей и всей формы #contacts
---

## Представление

### class abstract Component
Базовый абстрактный класс. От него наследуются классы-представления.
Содержит базовую логику отображения для всех классов-представлений.

* render(data?: Partial<T>): HTMLElement - возвращает готовый элемент для последующего помешения его в DOM дерево
* toggleClass(element: HTMLElement, className: string, force?: boolean): void - для добавления / удаления класса по условию force
* setText(element: HTMLElement, value: unknown): void - записать текст в элемент
* setDisabled(element: HTMLElement, state: boolean): void - заблокировать / разблокировать элемент 
по условию `state`
* setHidden(element: HTMLElement) - скрыть элемент
* setVisible(element: HTMLElement) - показать элемент
* setImage(element: HTMLImageElement, src: string, alt?: string) - установить атрибуты изображения
---

### class Basket extends Component<IBasketView> 
Класс отвечает за отображение содержимого корзины. Наследует класс Component
* constructor(container: HTMLElement, protected eventEmitter: EventEmitter) - container - HTML элемент, содержащий корзину
* set items(items: HTMLElement[]) - отрисовывает покупки в корзине
* set actionDisabled(total: number) - блокирует / разблокирует кнопку по условию
* set total(sum: number) - записывает в элемент корзины сумму покупки

### class ProductView extends Component<IProductView>
Отображение одного товара в каталоге. Наследует класс Component
* constructor(protected container: HTMLElement, actions?: IActions) - создает элемент карточки товара и вешает обработчик клика по карточке.
* get / set id(value: string): void
* get / set title(value: string): void
* set category (value: string)
* set price (value: number | null)
* set description (value: string | string[])
* set image(value: string): void
* actionTitle (value: string) устанавливает title кнопки
* quantity (value: number) устанавливает количество штук покупки

### class PageView extends Component<IPage>
Отображение каталога товаров. Наследует класс Component
* set catalog (items: HTMLElement[]) - отвечает за отрисовку каталога с карточками товаров.
* set counter(value: number) - на иконке корзины устанавливает количество позиций в корзинею
* set locked(value: boolean) - блокирует / разблокирует прокрутки всей страницы по условию.


### class Modal extends Component<IModalData>
Отображение модального окна. Наследует класс Component
* constructor(container: HTMLElement, protected events: IEvents) - создает модальное окно, добавляет обработчики клика по кнпке закрытия попапа и по оверлею
* set content(value: HTMLElement) - заполняет смысловую часть попапа.
* open() - обработчик, который сработает в момент открытия попапа. В частности, нужен, чтобы добавить обработчики событий клавиатуры
* close() - сработает в момент закрытия попапа. В частности, нужен, чтобы удалить обработчики событий клавиатуры
* render(data: IModalData): HTMLElement - открывает попап с новым содержимым

### class OrderView extends Form<IOrderForm>
Отображение формы с адресом и способом оплаты пользователя в модальном окне.
* constructor(container: HTMLFormElement, protected eventEmitter: IEvents) инициализирует форму на основе шаблона в верстке
* set payment (value: string): void записывает способ оплаты, выбранный пользователем
* set address (value: string): void записывает адрес, введенный пользователем пользователем
* render(data: any): HTMLFormElement возвращает форму

### class ContactsView extends Form<IContactsForm>
Отображение формы с телефоном и адресом электронной почты пользователя в модальном окне.
* constructor(container: HTMLFormElement, protected events: IEvents) создает форму на основе шаблона в верстке
* set phone (value: string) записывает телефон пользователя
* set email (value: string) записывает email пользователя
* render(data: any): HTMLFormElement возвращает форму

### class SuccessPopup
Отображение попапа с результатом успешно оформленного заказа.
* constructor(container: HTMLFormElement, eventEmitter: IEvents) инициализирует содержимое компонента Success
* set total (value: number): void записывает сумму, списанную за оформленный заказ

---

