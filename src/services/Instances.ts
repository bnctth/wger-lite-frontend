import {ITokenService, TokenService} from "./TokenService.ts";
import {ApiService, IApiService} from "./ApiService.ts";

const _tokenService = new TokenService();
const _apiService = new ApiService(_tokenService);
_tokenService.tokenProvider = _apiService


export const apiService: IApiService = _apiService
export const tokenService: ITokenService = _tokenService;
