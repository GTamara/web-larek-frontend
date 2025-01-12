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

* getProductList (): IProductListResponse 
* getProductItem (id: string): IProduct
* placeNewOrder (order: IOrder): TSetNewOrderResponce

---

## Модели данных

### class BasketModel 
Имплементирует интерфейс `IBasketModel`

```
interface IBasketModel {
	items: Record<Product, quantity>;
	addItem (id: string): void;
	removeItem (id: string): void;
	clearCard (): void;
	calculateTotal (items: Record<Product, quantity>): number 
}
```

Класс предназначен для управления списком покупок. 
Список покупок будет храниться в `items: Map<IProduct, number>`. items инициализируется пустым массивом.

* addItem (id: string): void - добавление товара в корзину
* removeItem (id: string): void - удаление товара из корзины
* resetBasket () - очистить корзину после того, как заказ был усмешно создан
* calculateTotal (items: Record<Product, quantity>): number - вычислить стоимость товаров в корзине
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
Класс предназначен для управления данными покупателя. При инициализации класса поля принимают значение `undefined`

* set / get email - записать / прочитать почту пользователя
* set / get phone - записать / прочитать телефон пользователя
* set / get address - записать / прочитать адрес пользователя
* set / get paymentMethod - записать / прочитать способ оплаты пользователя
---

## Представление

### class abstract Component
Базовый абстрактный класс. От него наследуются классы-представления.
Содержит базовую логику отображения для всех классов-представлений.

* render(data?: Partial<T>): HTMLElement - возвращает готовый элемент для последующего помешения его в DOM дерево
* toggleClass(element: HTMLElement, className: string, force?: boolean): void - для добавления / удаления класса по условию force
---

### class BasketView
Отображение содержимого корзины. Наследует класс Component
* itemsContainer: HTMLElement - контейнер для отображения списка товаров в корзине
* totalElement: HTMLElement - элемент, в котором выводится общая стоимость товаров корзины
* constructor (container: HTMLElement) {} - container - контейнер для всей корзины
* set itemsList (items: IProduct[]) - отрисовывает список покупок в корзине
* set total (value: number) - отрисовывает список покупок в корзине

### class ProductView
Отображение одного товара в каталоге. Наследует класс Component
* init (): void - создает элемент карточки товара и вешает обработчик клика по карточке.
* set title(value: string): void
* set category(value: string): void
* set price(value: string): void
* set description(value: string): void
* set image(value: string): void

### class PageView
Отображение каталога товаров. Наследует класс Component
* set items (items: IProduct[]): void - создает каталог с карточками товаров.

### class Modal
Отображение модального окна. Наследует класс Component
* init (): void - создает модальное окно, добавляет обработчики клика по кнпке закрытия попапа и по оверлею
* set content (data: C): void - заполняет смысловую часть попапа.
* set header (data: H): void - записывает значение в заголовок попапа. Проброс данных во вложенные отображения
* onOpenHandler() - обработчик, который сработает в момент открытия попапа. В частности, нужен, чтобы добавить обработчики событий клавиатуры
* onCloseHandler(event?: MouseEvent) - сработает в момент закрытия попапа. В частности, нужен, чтобы удалить обработчики событий клавиатуры
* set isActive(state: boolean) - Открытие и закрытие модального окна

### class UserDataView
Отображение формы с адресом и способом оплаты пользователя в модальном окне.
* init () создает форму на основе шаблона в верстке и вешает на форму обработчик события submit 
* set paymentMethod (value: string): void записывает способ оплаты, выбранный пользователем
* set address (value: string): void записывает адрес, введенный пользователем пользователем
* onSubmitHandler(event: SubmitEvent) обработчик события submit

### class ContactsView
Отображение формы с телефоном и адресом электронной почты пользователя в модальном окне.
* init () создает форму на основе шаблона в верстке и вешает на форму обработчик события submit 
* set paymentMethod (value: string): void записывает способ оплаты, выбранный пользователем
* set address (value: string): void записывает адрес, введенный пользователем пользователем
* onSubmitHandler(event: SubmitEvent) обработчик события submit

### class SuccessPopup
Отображение попапа с результатом успешно оформленного заказа.
* init () создает форму на основе шаблона в верстке
* set total (value: string): void записывает сумму, списанную за оформленный заказ

---

