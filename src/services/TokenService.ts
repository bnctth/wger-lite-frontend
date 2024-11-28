import {ApiError} from "./ApiService.ts";
import {decodeJwt} from "jose";
import {EitherAsync} from "purify-ts";
import {ITokenProvider} from "./TokenProvider.ts";

const ACCESS_TOKEN = 'access-token'
const REFRESH_TOKEN = 'refresh-token'

export type TokenServiceError = { kind: TokenServiceErrorKind.NotLoggedIn | TokenServiceErrorKind.NoTokenProvider } | {
    kind: TokenServiceErrorKind.CouldNotRefresh,
    error: ApiError
}

export enum TokenServiceErrorKind {
    NotLoggedIn,
    CouldNotRefresh,
    NoTokenProvider
}

export class TokenService implements ITokenService {
    private _accessToken: string | null
    private _refreshToken: string | null
    private _tokenProvider: ITokenProvider | undefined

    constructor() {
        this._accessToken = localStorage.getItem(ACCESS_TOKEN)
        this._refreshToken = localStorage.getItem(REFRESH_TOKEN)
    }

    login({access, refresh}: { access: string; refresh: string; }): void {
        this._accessToken = access
        this._refreshToken = refresh
    }

    set tokenProvider(value: ITokenProvider) {
        this._tokenProvider = value;
    }

    isLoggedIn(): boolean {
        return !!this._accessToken
    }

    getAccessToken(): EitherAsync<TokenServiceError, string> {
        return EitherAsync(async ({throwE}) => {
            if (!this._tokenProvider) {
                throwE({kind: TokenServiceErrorKind.NoTokenProvider})
                    return '' // necessary due to ts bug
                }
                if (!this._accessToken || !this._refreshToken) {
                    throwE({kind: TokenServiceErrorKind.NotLoggedIn})
                    return ''
                }

                const payload = decodeJwt(this._accessToken)
                if ((payload.exp ?? -1) < Date.now() / 1000) {
                    const resp = await this._tokenProvider.refreshToken(this._refreshToken).run()
                    resp
                        .ifLeft(err => {
                            this._accessToken = this._refreshToken = null
                            throwE({kind: TokenServiceErrorKind.CouldNotRefresh, error: err})
                        })
                        .ifRight(({access}) => this._accessToken = access)
                }
                return this._accessToken
            }
        )
    }
}

export interface ITokenService {
    getAccessToken(): EitherAsync<TokenServiceError, string>

    isLoggedIn(): boolean

    login(resp: { access: string, refresh: string }): void
}