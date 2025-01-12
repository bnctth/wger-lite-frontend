import { ApiError } from "./ApiService.ts";
import { decodeJwt } from "jose";
import { EitherAsync } from "purify-ts";
import { ITokenProvider } from "./TokenProvider.ts";

const ACCESS_TOKEN = "access-token";
const REFRESH_TOKEN = "refresh-token";

/**
 * TokenServiceError is an error that can occur when using the TokenService
 */
export type TokenServiceError =
  | {
  /**
   * kind is the kind of error that occurred
   */
  kind:
    | TokenServiceErrorKind.NotLoggedIn
    | TokenServiceErrorKind.NoTokenProvider;
}
  | {
  kind: TokenServiceErrorKind.CouldNotRefresh;
  /**
   * error is the ApiError that occurred when trying to refresh the token
   */
  error: ApiError;
};

/**
 * TokenServiceErrorKind is the kind of error that can occur when using the TokenService
 */
export enum TokenServiceErrorKind {
  /**
   * NotLoggedIn is returned when the user is not logged in
   */
  NotLoggedIn,
  /**
   * CouldNotRefresh is returned when the token could not be refreshed
   */
  CouldNotRefresh,
  /**
   * NoTokenProvider is returned when the TokenService does not have a token provider
   */
  NoTokenProvider,
}

/**
 * TokenService is a service that manages the user's access and refresh tokens
 */
export class TokenService implements ITokenService {
  /**
   * Creates a new TokenService with the user's access and refresh tokens loaded from localStorage
   */
  constructor() {
    this._accessToken = localStorage.getItem(ACCESS_TOKEN);
    this._refreshToken = localStorage.getItem(REFRESH_TOKEN);
  }

  /**
   * _tokenProvider is the token provider that the TokenService uses to log in and refresh tokens
   * @private
   */
  private _tokenProvider: ITokenProvider | undefined;

  /**
   * tokenProvider simply sets _tokenProvider
   * @param value is the token provider to set
   */
  set tokenProvider(value: ITokenProvider) {
    this._tokenProvider = value;
  }

  /**
   * _accessToken is the user's access token
   * @private
   */
  private _accessToken: string | null;

  /**
   * simply returns _accessToken
   * @private
   */
  private get accessToken(): string | null {
    return this._accessToken;
  }

  /**
   * sets _accessToken and saves it to localStorage
   * @private
   */
  private set accessToken(access: string | null) {
    this._accessToken = access;
    if (access) {
      localStorage.setItem(ACCESS_TOKEN, access);
    } else {
      localStorage.removeItem(ACCESS_TOKEN);
    }
  }

  /**
   * _refreshToken is the user's refresh token
   * @private
   */
  private _refreshToken: string | null;

  /**
   * simply returns _refreshToken
   * @private
   */
  private get refreshToken(): string | null {
    return this._refreshToken;
  }

  /**
   * sets _refreshToken and saves it to localStorage
   * @param refresh
   * @private
   */
  private set refreshToken(refresh: string | null) {
    this._refreshToken = refresh;
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN, refresh);
    } else {
      localStorage.removeItem(REFRESH_TOKEN);
    }
  }

  /**
   * logout clears the user's access and refresh tokens
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  /**
   * login logs the user in with the given username and password
   * @param username is the user's username
   * @param password is the user's password
   * @returns an EitherAsync that resolves to null if the login was successful
   */
  login(
    username: string,
    password: string
  ): EitherAsync<ApiError | TokenServiceError, null> {
    return EitherAsync(async ({ throwE, liftEither }) => {
      if (!this._tokenProvider) {
        throwE({ kind: TokenServiceErrorKind.NoTokenProvider });
        return null;
      }
      return liftEither(
        await this._tokenProvider.login(username, password).run()
      );
    });
  }

  /**
   * handleLogin stores the user's access and refresh tokens
   * @param access is the user's access token
   * @param refresh is the user's refresh token
   */
  handleLogin({ access, refresh }: { access: string; refresh: string }): void {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  /**
   * isLoggedIn returns true if the user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  /**
   * getAccessToken returns the user's access token or refreshes it if it is expired
   * @returns an EitherAsync that resolves to the user's access token
   */
  getAccessToken(): EitherAsync<TokenServiceError, string> {
    return EitherAsync(async ({ throwE }) => {
      if (!this._tokenProvider) {
        throwE({ kind: TokenServiceErrorKind.NoTokenProvider });
        return ""; // necessary due to ts bug
      }
      if (!this.accessToken || !this.refreshToken) {
        throwE({ kind: TokenServiceErrorKind.NotLoggedIn });
        return "";
      }

      const payload = decodeJwt(this.accessToken);
      if ((payload.exp ?? -1) < Date.now() / 1000) {
        const resp = await this._tokenProvider
          .refreshToken(this.refreshToken)
          .run();
        resp
          .ifLeft((err) => {
            this.logout();
            throwE({ kind: TokenServiceErrorKind.CouldNotRefresh, error: err });
          })
          .ifRight(({ access }) => (this.accessToken = access));
      }
      return this.accessToken;
    });
  }
}

/**
 * ITokenService is the interface for the TokenService
 */
export interface ITokenService {
  /**
   * getAccessToken returns the user's access token or refreshes it if it is expired
   * @returns an EitherAsync that resolves to the user's access token
   */
  getAccessToken(): EitherAsync<TokenServiceError, string>;

  /**
   * isLoggedIn returns true if the user is logged in
   * @returns true if the user is logged in
   */
  isLoggedIn(): boolean;

  /**
   * login logs the user in with the given username and password
   * @param username is the user's username
   * @param password is the user's password
   * @returns an EitherAsync that resolves to null if the login was successful
   */
  login(
    username: string,
    password: string
  ): EitherAsync<ApiError | TokenServiceError, null>;

  /**
   * logout clears the user's access and refresh tokens
   */
  logout(): void;

  /**
   * saves the user's access and refresh tokens
   */
  handleLogin(resp: { access: string; refresh: string }): void;
}
