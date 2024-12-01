import {EitherAsync} from "purify-ts";

export const eitherAsyncToQueryFn = <T>(input: EitherAsync<unknown, T>): () => Promise<T> =>
    async () => (await input.run()).mapLeft(console.error).unsafeCoerce()
