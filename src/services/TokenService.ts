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
    private get accessToken(): string | null {
        return this._accessToken;
    }

    private set accessToken(access: string | null) {
        this._accessToken = access;
        if (access) {
            localStorage.setItem(ACCESS_TOKEN, access);
        } else {
            localStorage.removeItem(ACCESS_TOKEN)
        }
    }

    private _refreshToken: string | null
    private get refreshToken(): string | null {
        return this._refreshToken;
    }

    private set refreshToken(refresh: string | null) {
        this._refreshToken = refresh;
        if (refresh) {
            localStorage.setItem(REFRESH_TOKEN, refresh);
        } else {
            localStorage.removeItem(REFRESH_TOKEN)
        }
    }

    private _tokenProvider: ITokenProvider | undefined

    constructor() {
        this._accessToken = localStorage.getItem(ACCESS_TOKEN)
        this._refreshToken = localStorage.getItem(REFRESH_TOKEN)
    }

    logout(): void {
        this.accessToken = null;
        this.refreshToken = null;
    }

    login(username: string, password: string): EitherAsync<ApiError | TokenServiceError, null> {
        return EitherAsync(async ({throwE, liftEither}) => {
            if (!this._tokenProvider) {
                throwE({kind: TokenServiceErrorKind.NoTokenProvider})
                return null
            }
            return liftEither(await this._tokenProvider.login(username, password).run());
        })
    }

    handleLogin({access, refresh}: { access: string; refresh: string; }): void {
        this.accessToken = access
        this.refreshToken = refresh
    }

    set tokenProvider(value: ITokenProvider) {
        this._tokenProvider = value;
    }

    isLoggedIn(): boolean {
        return !!this.accessToken
    }

    getAccessToken(): EitherAsync<TokenServiceError, string> {
        return EitherAsync(async ({throwE}) => {
            if (!this._tokenProvider) {
                throwE({kind: TokenServiceErrorKind.NoTokenProvider})
                    return '' // necessary due to ts bug
                }
            if (!this.accessToken || !this.refreshToken) {
                    throwE({kind: TokenServiceErrorKind.NotLoggedIn})
                    return ''
                }

            const payload = decodeJwt(this.accessToken)
                if ((payload.exp ?? -1) < Date.now() / 1000) {
                    const resp = await this._tokenProvider.refreshToken(this.refreshToken).run()
                    resp
                        .ifLeft(err => {
                            this.logout()
                            throwE({kind: TokenServiceErrorKind.CouldNotRefresh, error: err})
                        })
                        .ifRight(({access}) => this.accessToken = access)
                }
            return this.accessToken
            }
        )
    }
}

export interface ITokenService {
    getAccessToken(): EitherAsync<TokenServiceError, string>

    isLoggedIn(): boolean

    login(username: string, password: string): EitherAsync<ApiError | TokenServiceError, null>

    logout(): void

    handleLogin(resp: { access: string, refresh: string }): void
}