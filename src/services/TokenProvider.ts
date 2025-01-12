import { EitherAsync } from "purify-ts";
import { ApiError } from "./ApiService.ts";

/**
 * TokenProvider is a service that provides tokens for the TokenService - production implementation uses the API itself
 */
export interface ITokenProvider {
  /**
   * Refreshes the access token using the refresh token
   * @param rt refresh token
   * @returns EitherAsync with the new access token
   */
  refreshToken(rt: string): EitherAsync<ApiError, { access: string }>;

  /**
   * Logs in the user
   * @param username username
   * @param password password
   * @returns EitherAsync with null
   */
  login(username: string, password: string): EitherAsync<ApiError, null>;
}
