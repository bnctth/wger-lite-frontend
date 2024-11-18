import {ITokenService, TokenServiceError} from "./TokenService.ts";
import {err, ok, Result} from "neverthrow";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpError = {
    status: number,
    body: string
}

export class ApiService implements IApiService {
    private _baseUrl: string | unknown
    private _tokenService: ITokenService

    constructor(ts: ITokenService) {
        this._tokenService = ts
    }

    async login(username: string, password: string): Promise<Result<null, HttpError>> {
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

    setBaseUrl(url: URL) {
        this._baseUrl = url
    }

    private async request<O>(path: string, method: HttpMethod, authHeader: string | null, body: Record<string, unknown> | undefined): Promise<Result<O, HttpError>> {
        let headers = {}
        if (authHeader) {
            headers = {authorization: authHeader}
        }
        const response = await fetch(`${this._baseUrl}/api/v2/${path}`, {
            method: method,
            body: JSON.stringify(body),
            headers: headers
        });
        if (!response.ok) {
            return err({status: response.status, body: await response.text()})
        }

        return ok(await response.json() as O)
    }

    private unauthenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): Promise<Result<O, HttpError>> {
        return this.request<O>(path, method, null, body)
    }

    private async authenticatedRequest<O>(path: string, method: HttpMethod, body: Record<string, unknown> | undefined): Promise<Result<O, HttpError | TokenServiceError>> {
        const token = await this._tokenService.getAccessToken()
        if (token.isErr()) {
            return err(token.error)
        }
        return this.request(path, method, `Bearer ${token.value}`, body)
    }

    async refreshToken(rt: string): Promise<Result<{ access: string }, HttpError>> {
        return this.unauthenticatedRequest('refresh', 'POST', {refresh: rt})
    }

}

export interface IApiService {
    login(username: string, password: string): Promise<Result<null, HttpError>>

    setBaseUrl(url: URL): void

    refreshToken(rt: string): Promise<Result<{ access: string }, HttpError>>

}

