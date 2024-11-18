import {err, ok, Result} from "neverthrow";
import {HttpError, IApiService} from "./ApiService.ts";
import {decodeJwt} from "jose";

const ACCESS_TOKEN = 'access-token'
const REFRESH_TOKEN = 'refresh-token'

export type TokenServiceError = { kind: TokenServiceErrorKind.NotLoggedIn | TokenServiceErrorKind.NoApiService } | {
    kind: TokenServiceErrorKind.CouldNotRefresh,
    error: HttpError
}

export enum TokenServiceErrorKind {
    NotLoggedIn,
    CouldNotRefresh,
    NoApiService
}

export class TokenService implements ITokenService {
    private _accessToken: string | null
    private _refreshToken: string | null
    private _apiService: IApiService | undefined

    constructor() {
        this._accessToken = localStorage.getItem(ACCESS_TOKEN)
        this._refreshToken = localStorage.getItem(REFRESH_TOKEN)
    }

    login({access, refresh}: { access: string; refresh: string; }): void {
        this._accessToken = access
        this._refreshToken = refresh
    }

    set apiService(value: IApiService) {
        this._apiService = value;
    }

    isLoggedIn(): boolean {
        return !!this._accessToken
    }

    async getAccessToken(): Promise<Result<string, TokenServiceError>> {
        if (!this._apiService) {
            return err({kind: TokenServiceErrorKind.NoApiService})
        }
        if (!this._accessToken || !this._refreshToken) {
            return err({kind: TokenServiceErrorKind.NotLoggedIn})
        }

        const payload = decodeJwt(this._accessToken)
        if ((payload.exp ?? -1) < Date.now() / 1000) {
            const resp = await this._apiService.refreshToken(this._refreshToken)
            if (resp.isErr()) {
                this._accessToken = this._refreshToken = null
                return err({kind: TokenServiceErrorKind.CouldNotRefresh, error: resp.error})
            }
            this._accessToken = resp.value.access
        }
        return ok(this._accessToken)
    }
}

export interface ITokenService {
    set apiService(as: IApiService)

    getAccessToken(): Promise<Result<string, TokenServiceError>>

    isLoggedIn(): boolean

    login(resp: { access: string, refresh: string }): void
}