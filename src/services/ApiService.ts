import {ITokenService, TokenServiceError} from "./TokenService.ts";
import {err, ok, Result} from "neverthrow";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export enum ApiErrorKind {
    HttpError,
    NoBaseUrl
}

export type ApiError = { kind: ApiErrorKind.NoBaseUrl } | {
    kind: ApiErrorKind.HttpError,
    status: number,
    body: string
}

export class ApiService implements IApiService {
    baseUrl: string | undefined
    private readonly _tokenService: ITokenService

    constructor(ts: ITokenService) {
        this._tokenService = ts
    }

    async login(username: string, password: string): Promise<Result<null, ApiError>> {
        const response = await this.unauthenticatedRequest<{
            access: string,
            refresh: string
        }>('token', 'POST', {username: username, password: password});
        if (response.isErr()) {
            return err(response.error)
        }
        this._tokenService.login(response.value)
        return ok(null)
    }

    private async request<O>(path: string, method: HttpMethod, authHeader: string | null, body: Record<string, unknown> | undefined): Promise<Result<O, ApiError>> {
        if (!this.baseUrl) {
            return err({kind: ApiErrorKind.NoBaseUrl})
        }
        let headers = {}
        if (authHeader) {
            headers = {authorization: authHeader}
        }
        const response = await fetch(`${this.baseUrl}/api/v2/${path}`, {
            method: method,
            body: JSON.stringify(body),
            headers: headers
        });
        if (!response.ok) {
            return err({kind: ApiErrorKind.HttpError, status: response.status, body: await response.text()})
        }

        return ok(await response.json() as O)
    }

    private unauthenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): Promise<Result<O, ApiError>> {
        return this.request<O>(path, method, null, body)
    }

    private async authenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): Promise<Result<O, ApiError | TokenServiceError>> {
        const token = await this._tokenService.getAccessToken()
        if (token.isErr()) {
            return err(token.error)
        }
        return this.request(path, method, `Bearer ${token.value}`, body)
    }

    async checkServer() {
        const resp = await this.unauthenticatedRequest<string>('version', 'GET', undefined)
        return resp.map(_ => null)
    }

    async refreshToken(rt: string): Promise<Result<{ access: string }, ApiError>> {
        return this.unauthenticatedRequest('refresh', 'POST', {refresh: rt})
    }

}

export interface IApiService {
    get baseUrl(): string | undefined

    set baseUrl(b: string | undefined)

    refreshToken(rt: string): Promise<Result<{ access: string }, ApiError>>

    checkServer(): Promise<Result<null, ApiError>>

    login(username: string, password: string): Promise<Result<null, ApiError>>

}

