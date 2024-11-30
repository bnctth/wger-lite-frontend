import {ITokenService} from "./TokenService.ts";
import {EitherAsync, Right} from "purify-ts";
import {ITokenProvider} from "./TokenProvider.ts";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const BASE_URL = 'base-url'

export enum ApiErrorKind {
    HttpError,
    NoBaseUrl
}

export type ApiError = { kind: ApiErrorKind.NoBaseUrl } | {
    kind: ApiErrorKind.HttpError,
    status: number,
    body: string
}

export class ApiService implements IApiService, ITokenProvider {
    constructor(ts: ITokenService) {
        this._tokenService = ts
        this._baseUrl = localStorage.getItem(BASE_URL) ?? undefined
    }
    private readonly _tokenService: ITokenService

    private _baseUrl: string | undefined

    get baseUrl(): string | undefined {
        return this._baseUrl
    }

    set baseUrl(b: string | undefined) {
        this._baseUrl = b
        if (b) {
            localStorage.setItem(BASE_URL, b)
        } else {
            localStorage.removeItem(BASE_URL)
        }
    }

    login(username: string, password: string): EitherAsync<ApiError, null> {
        return this.unauthenticatedRequest<{
            access: string,
            refresh: string
        }>('token', 'POST', {username: username, password: password})
            .chain(async resp => {
                this._tokenService.handleLogin(resp)
                return Right(null)
            })
    }


    private request<O>(path: string, method: HttpMethod, authHeader: string | null, body: Record<string, unknown> | undefined): EitherAsync<ApiError, O> {
        return EitherAsync(async ({throwE}) => {
            if (!this.baseUrl) {
                throwE({kind: ApiErrorKind.NoBaseUrl})
            }
            let headers: HeadersInit = {
                'content-type': 'application/json'
            }
            if (authHeader) {
                headers = {authorization: authHeader, ...headers}
            }
            const response = await fetch(`${this.baseUrl}/api/v2/${path}`, {
                method: method,
                body: JSON.stringify(body),
                headers: headers
            });
            if (!response.ok) {
                throwE({kind: ApiErrorKind.HttpError, status: response.status, body: await response.text()})
            }
            return await response.json() as O
        })
    }

    private unauthenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): EitherAsync<ApiError, O> {
        return this.request<O>(path, method, null, body)
    }

    /*private authenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): EitherAsync<ApiError | TokenServiceError, O> {
        return this._tokenService.getAccessToken()
            .chain(token => this.request(path, method, `Bearer ${token}`, body))
    }*/

    checkServer(): EitherAsync<ApiError, null> {
        return this.unauthenticatedRequest<string>('version', 'GET', undefined).map(() => null)
    }

    refreshToken(rt: string): EitherAsync<ApiError, { access: string }> {
        return this.unauthenticatedRequest('refresh', 'POST', {refresh: rt})
    }

}

export interface IApiService {
    get baseUrl(): string | undefined

    set baseUrl(b: string | undefined)

    checkServer(): EitherAsync<ApiError, null>
}

