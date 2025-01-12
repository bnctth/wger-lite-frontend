import { ITokenService, TokenServiceError } from "./TokenService.ts";
import { EitherAsync, Right } from "purify-ts";
import { ITokenProvider } from "./TokenProvider.ts";
import { PaginatedDataListDto, UserProfileDto } from "./Dtos.ts";
import { CrudEndpoint } from "./CrudEndpoint.ts";

/**
 * HttpMethod is a type that represents the HTTP methods that are supported.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Constant for storing the base URL in the local storage.
 */
const BASE_URL = "base-url";

/**
 * ApiErrorKind is an enum that represents the different kinds of errors that can occur when using the API.
 */
export enum ApiErrorKind {
  /**
   * HttpError represents an error that occurs when the server returns an error status code.
   */
  HttpError,
  /**
   * NoBaseUrl represents an error that occurs when the base URL is not set.
   */
  NoBaseUrl,
  /**
   * TokenServiceError represents an error that occurs when the token service returns an error.
   */
  TokenServiceError,
}

/**
 * String that can be undefined.
 */
type UndefinableString = string | undefined;

/**
 * When T is a string, MaybeNumber<T> is a number, otherwise it is undefined.
 * Meaning T is defined if and only if the value of this type is.
 */
export type MaybeNumber<T extends string | undefined> = T extends string
  ? number
  : undefined;

/**
 * ApiError is a type that represents an error that can occur when using the API.
 */
export type ApiError =
  | {
  /**
   * kind is the kind of error that occurred.
   */
  kind: ApiErrorKind.NoBaseUrl;
}
  | {
  kind: ApiErrorKind.HttpError;
  /**
   * status is the HTTP status code of the error.
   */
  status: number;
  /**
   * body is the body of the error response.
   */
  body: string;
}
  | {
  kind: ApiErrorKind.TokenServiceError;
  /**
   * source is the error that occurred in the token service.
   */
  source: TokenServiceError;
};

/**
 * ApiService is a class that implements the IApiService and ITokenProvider interfaces.
 * It is responsible for making requests to the API and handling authentication.
 * It uses the ITokenService to handle authentication.
 * It also stores the base URL in the local storage.
 */
export class ApiService implements IApiService, ITokenProvider {
  /**
   * _tokenService is the token service that is used to handle authentication.
   * @private
   */
  private readonly _tokenService: ITokenService;

  /**
   * Creates a new ApiService.
   * Loads the base URL from the local storage.
   * @param ts is the token service that is used to handle authentication-
   */
  constructor(ts: ITokenService) {
    this._tokenService = ts;
    this._baseUrl = localStorage.getItem(BASE_URL) ?? undefined;
  }

  /**
   * _baseUrl is the base URL to use with the API.
   * @private
   */
  private _baseUrl: string | undefined;

  /**
   * simply returns the _baseUrl
   */
  get baseUrl(): string | undefined {
    return this._baseUrl;
  }

  /**
   * Sets the base URL and stores it in the local storage.
   * @param b
   */
  set baseUrl(b: string | undefined) {
    this._baseUrl = b;
    if (b) {
      localStorage.setItem(BASE_URL, b);
    } else {
      localStorage.removeItem(BASE_URL);
    }
  }

  /**
   * Logs in the user with the given username and password.
   * @param username the username of the user
   * @param password the password of the user
   */
  login(username: string, password: string): EitherAsync<ApiError, null> {
    return this.unauthenticatedRequest<{
      access: string;
      refresh: string;
    }>("token", "POST", { username: username, password: password }).chain(
      async (resp) => {
        this._tokenService.handleLogin(resp);
        return Right(null);
      }
    );
  }

  /**
   * Refreshes the access token with the given refresh token.
   * @param rt the refresh token to use
   * @returns an EitherAsync that resolves to the new access token or an error
   */
  refreshToken(rt: string): EitherAsync<ApiError, { access: string }> {
    return this.unauthenticatedRequest("token/refresh", "POST", {
      refresh: rt
    });
  }

  /**
   * Checks if the server is reachable.
   * @returns an EitherAsync that resolves to null or an error
   */
  checkServer(): EitherAsync<ApiError, null> {
    return this.unauthenticatedRequest<string>("version", "GET", undefined).map(
      () => null
    );
  }

  /**
   * Returns the user profile of the currently authenticated user.
   */
  userInfo(): EitherAsync<ApiError, UserProfileDto> {
    return this.authenticatedRequest("userprofile/", "GET");
  }

  /**
   * Generic crud operation, list all items of a given type with pagination, ordering and optional parent.
   * @param endpoint the endpoint to use
   * @param offset the offset to use
   * @param limit the limit to use
   * @param parent id of the parent if any
   * @param ordering the name of the column to order by (default is id)
   * @returns an EitherAsync that resolves to the list of items or an error
   */
  list<TViewDto, TParent extends string | undefined>(
    endpoint: CrudEndpoint<unknown, TViewDto, TParent>,
    offset: number,
    limit: number,
    parent: MaybeNumber<TParent>,
    ordering = "id"
  ): EitherAsync<ApiError, PaginatedDataListDto<TViewDto>> {
    const parentQuery =
      typeof parent === "number" ? `&${endpoint.parent}=${parent}` : "";
    return this.authenticatedRequest(
      `${endpoint.name}/?limit=${limit}&offset=${offset}&ordering=${ordering}${parentQuery}`,
      "GET"
    );
  }

  /**
   * Generic crud operation, read an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to read
   * @returns an EitherAsync that resolves to the item or an error
   */
  read<TViewDto>(
    endpoint: CrudEndpoint<unknown, TViewDto, UndefinableString>,
    id: number
  ): EitherAsync<ApiError, TViewDto> {
    return this.authenticatedRequest(`${endpoint.name}/${id}`, "GET");
  }

  /**
   * Generic crud operation, create an item of a given type.
   * @param endpoint the endpoint to use
   * @param dto the item to create
   * @returns an EitherAsync that resolves to the created item or an error
   */
  create<TEditDto extends Record<string, unknown>, TViewDto>(
    endpoint: CrudEndpoint<TEditDto, TViewDto, UndefinableString>,
    dto: TEditDto
  ): EitherAsync<ApiError, TViewDto> {
    return this.authenticatedRequest(`${endpoint.name}/`, "POST", dto);
  }

  /**
   * Generic crud operation, delete an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to delete
   * @returns an EitherAsync that resolves to null or an error
   */
  delete(
    endpoint: CrudEndpoint<unknown, unknown, UndefinableString>,
    id: number
  ): EitherAsync<ApiError, null> {
    return this.authenticatedRequest(`${endpoint.name}/${id}/`, "DELETE");
  }

  /**
   * Generic crud operation, update an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to update
   * @param dto the item to update
   */
  update<TEditWorkout extends Record<string, unknown>, TViewDto>(
    endpoint: CrudEndpoint<TEditWorkout, TViewDto, UndefinableString>,
    id: number,
    dto: TEditWorkout
  ): EitherAsync<ApiError, TViewDto> {
    return this.authenticatedRequest(`${endpoint.name}/${id}/`, "PUT", dto);
  }

  /**
   * Low level function to make a request to the API.
   * @param path the path of the API endpoint
   * @param method the HTTP method to use
   * @param authHeader the authorization header to use
   * @param body the body of the request optionally
   * @private
   * @returns an EitherAsync that resolves to the response body or an error
   */
  private request<O>(
    path: string,
    method: HttpMethod,
    authHeader: string | null,
    body: Record<string, unknown> | undefined
  ): EitherAsync<ApiError, O> {
    return EitherAsync(async ({ throwE }) => {
      if (!this.baseUrl) {
        throwE({ kind: ApiErrorKind.NoBaseUrl });
      }
      let headers: HeadersInit = {
        "content-type": "application/json"
      };
      if (authHeader) {
        headers = { authorization: authHeader, ...headers };
      }
      const response = await fetch(`${this.baseUrl}/api/v2/${path}`, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
      });
      if (!response.ok) {
        throwE({
          kind: ApiErrorKind.HttpError,
          status: response.status,
          body: await response.text()
        });
      }
      try {
        return (await response.json()) as O;
      } catch (e) {
        console.error(e);
        return null as O; // should only happen when O is already null
      }
    });
  }

  /**
   * Low level function to make an unauthenticated request to the API.
   * @param path the path of the API endpoint
   * @param method the HTTP method to use
   * @param body the body of the request optionally
   * @private
   */
  private unauthenticatedRequest<O>(
    path: string,
    method: HttpMethod,
    body: Record<string, unknown> | undefined
  ): EitherAsync<ApiError, O> {
    return this.request<O>(path, method, null, body);
  }

  /**
   * Low level function to make an authenticated request to the API. If the access token is expired, it will be refreshed.
   * @param path the path of the API endpoint
   * @param method the HTTP method to use
   * @param body the body of the request optionally
   * @private
   */
  private authenticatedRequest<O>(
    path: string,
    method: HttpMethod,
    body?: Record<string, unknown>
  ): EitherAsync<ApiError, O> {
    return this._tokenService
      .getAccessToken()
      .mapLeft(
        (tse): ApiError => ({
          kind: ApiErrorKind.TokenServiceError,
          source: tse
        })
      )
      .chain((token) => this.request(path, method, `Bearer ${token}`, body));
  }
}

/**
 * IApiService is an interface that represents a service that can interact with the API.
 */
export interface IApiService {
  /**
   * baseUrl is the base URL to use with the API.
   * @returns the base URL
   */
  get baseUrl(): string | undefined;

  /**
   * set the base URL
   * @param b the base URL to set
   */
  set baseUrl(b: string | undefined);

  /**
   * Checks if the server is reachable.
   * @returns an EitherAsync that resolves to null or an error
   */
  checkServer(): EitherAsync<ApiError, null>;

  /**
   * Generic crud operation, list all items of a given type with pagination, ordering and optional parent.
   * @param endpoint the endpoint to use
   * @param offset the offset to use
   * @param limit the limit to use
   * @param parent id of the parent if any
   * @param ordering the name of the column to order by (default is id)
   */
  list<TViewDto, TParent extends string | undefined>(
    endpoint: CrudEndpoint<unknown, TViewDto, TParent>,
    offset: number,
    limit: number,
    parent: TParent extends string ? number : undefined,
    ordering?: string
  ): EitherAsync<ApiError, PaginatedDataListDto<TViewDto>>;

  /**
   * Generic crud operation, read an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to read
   */
  read<TViewDto>(
    endpoint: CrudEndpoint<unknown, TViewDto, UndefinableString>,
    id: number
  ): EitherAsync<ApiError, TViewDto>;

  /**
   * Generic crud operation, create an item of a given type.
   * @param endpoint the endpoint to use
   * @param dto the item to create
   */
  create<TEditDto extends Record<string, unknown>, TViewDto>(
    endpoint: CrudEndpoint<TEditDto, TViewDto, UndefinableString>,
    dto: TEditDto
  ): EitherAsync<ApiError, TViewDto>;

  /**
   * Generic crud operation, update an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to update
   * @param dto the item to update
   */
  update<TEditWorkout extends Record<string, unknown>, TViewDto>(
    endpoint: CrudEndpoint<TEditWorkout, TViewDto, UndefinableString>,
    id: number,
    dto: TEditWorkout
  ): EitherAsync<ApiError, TViewDto>;

  /**
   * Generic crud operation, delete an item of a given type by id.
   * @param endpoint the endpoint to use
   * @param id the id of the item to delete
   */
  delete(
    endpoint: CrudEndpoint<unknown, unknown, string | undefined>,
    id: number
  ): EitherAsync<ApiError, null>;

  /**
   * User profile of the currently authenticated user.
   * @returns an EitherAsync that resolves to the user profile or an error
   */
  userInfo(): EitherAsync<ApiError, UserProfileDto>;
}
