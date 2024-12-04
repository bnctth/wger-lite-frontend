import {ITokenService, TokenServiceError} from "./TokenService.ts";
import {EitherAsync, Right} from "purify-ts";
import {ITokenProvider} from "./TokenProvider.ts";
import {PaginatedDataListDto, UserProfileDto} from "./Dtos.ts";
import {CrudEndpoint} from "./CrudEndpoint.ts";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const BASE_URL = 'base-url'

export enum ApiErrorKind {
    HttpError,
    NoBaseUrl,
    TokenServiceError
}

type UndefinableString = string | undefined


export type MaybeNumber<T extends string | undefined> = T extends string ? number : undefined

export type ApiError = { kind: ApiErrorKind.NoBaseUrl } | {
    kind: ApiErrorKind.HttpError,
    status: number,
    body: string
} | {
    kind: ApiErrorKind.TokenServiceError,
    source: TokenServiceError
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
            try {
                return await response.json() as O
            } catch (e) {
                console.error(e)
                return null as O // should only happen when O is already null
            }
        })
    }

    private unauthenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): EitherAsync<ApiError, O> {
        return this.request<O>(path, method, null, body)
    }

    refreshToken(rt: string): EitherAsync<ApiError, { access: string }> {
        return this.unauthenticatedRequest('token/refresh', 'POST', {refresh: rt})
    }

    checkServer(): EitherAsync<ApiError, null> {
        return this.unauthenticatedRequest<string>('version', 'GET', undefined).map(() => null)
    }

    private authenticatedRequest<O>(path: string, method: HttpMethod, body?: Record<string, unknown>): EitherAsync<ApiError, O> {
        return this._tokenService.getAccessToken()
            .mapLeft((tse): ApiError => ({kind: ApiErrorKind.TokenServiceError, source: tse}))
            .chain(token => this.request(path, method, `Bearer ${token}`, body))
    }


    userInfo(): EitherAsync<ApiError, UserProfileDto> {
        return this.authenticatedRequest('userprofile/', 'GET');
    }


    list<TViewDto, TParent extends string | undefined>(endpoint: CrudEndpoint<unknown, TViewDto, TParent>, offset: number, limit: number, parent: MaybeNumber<TParent>, ordering = 'id'): EitherAsync<ApiError, PaginatedDataListDto<TViewDto>> {
        const parentQuery = typeof parent === 'number' ? `&${endpoint.parent}=${parent}` : '';
        return this.authenticatedRequest(`${endpoint.name}/?limit=${limit}&offset=${offset}&ordering=${ordering}${parentQuery}`, 'GET')
    }

    read<TViewDto>(endpoint: CrudEndpoint<unknown, TViewDto, UndefinableString>, id: number): EitherAsync<ApiError, TViewDto> {
        return this.authenticatedRequest(`${endpoint.name}/${id}`, 'GET');
    }

    create<TEditDto extends Record<string, unknown>, TViewDto>(endpoint: CrudEndpoint<TEditDto, TViewDto, UndefinableString>, dto: TEditDto): EitherAsync<ApiError, TViewDto> {
        return this.authenticatedRequest(`${endpoint.name}/`, 'POST', dto);
    }

    delete(endpoint: CrudEndpoint<unknown, unknown, UndefinableString>, id: number): EitherAsync<ApiError, null> {
        return this.authenticatedRequest(`${endpoint.name}/${id}/`, 'DELETE');
    }

    update<TEditWorkout extends Record<string, unknown>, TViewDto>(endpoint: CrudEndpoint<TEditWorkout, TViewDto, UndefinableString>, id: number, dto: TEditWorkout): EitherAsync<ApiError, TViewDto> {
        return this.authenticatedRequest(`${endpoint.name}/${id}/`, 'PUT', dto);
    }

}

export interface IApiService {
    get baseUrl(): string | undefined

    set baseUrl(b: string | undefined)

    checkServer(): EitherAsync<ApiError, null>

    list<TViewDto, TParent extends string | undefined>(endpoint: CrudEndpoint<unknown, TViewDto, TParent>, offset: number, limit: number, parent: (TParent extends string ? number : undefined), ordering?: string): EitherAsync<ApiError, PaginatedDataListDto<TViewDto>>

    read<TViewDto>(endpoint: CrudEndpoint<unknown, TViewDto, UndefinableString>, id: number): EitherAsync<ApiError, TViewDto>

    create<TEditDto extends Record<string, unknown>, TViewDto>(endpoint: CrudEndpoint<TEditDto, TViewDto, UndefinableString>, dto: TEditDto): EitherAsync<ApiError, TViewDto>

    update<TEditWorkout extends Record<string, unknown>, TViewDto>(endpoint: CrudEndpoint<TEditWorkout, TViewDto, UndefinableString>, id: number, dto: TEditWorkout): EitherAsync<ApiError, TViewDto>

    delete(endpoint: CrudEndpoint<unknown, unknown, string | undefined>, id: number): EitherAsync<ApiError, null>

    userInfo(): EitherAsync<ApiError, UserProfileDto>
}

