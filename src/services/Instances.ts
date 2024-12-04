import {ITokenService, TokenService} from "./TokenService.ts";
import {ApiService, IApiService} from "./ApiService.ts";
import {createContext} from "react";

const _tokenService = new TokenService();
const _apiService = new ApiService(_tokenService);
_tokenService.tokenProvider = _apiService

/**
 * Contexts to receive an IApiService instance
 */
export const ApiServiceContext = createContext(_apiService as IApiService)
/**
 * Contexts to receive an ITokenService instance
 */
export const TokenServiceContext = createContext(_tokenService as ITokenService)
