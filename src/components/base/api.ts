export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET' as ApiPostMethods,
        }).then((response) => this.handleResponse<T>(response));
    }

    post<D, T>(uri: string, data: D) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'POST' as ApiPostMethods,
            body: JSON.stringify(data)
        }).then((response) =>this.handleResponse<T>(response));
    }
}
