import {ITokenService, TokenService} from "./TokenService.ts";
import {ApiService, IApiService} from "./ApiService.ts";

export const tokenService: ITokenService = new TokenService()
export const apiService: IApiService = new ApiService(tokenService)
tokenService.apiService = apiService
