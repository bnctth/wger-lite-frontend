import {EitherAsync} from "purify-ts";
import {ApiError} from "./ApiService.ts";

export interface ITokenProvider {
    refreshToken(rt: string): EitherAsync<ApiError, { access: string }>

    login(username: string, password: string): EitherAsync<ApiError, null>
}