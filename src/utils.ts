import {EitherAsync} from "purify-ts";
import {UseMutationResult} from "@tanstack/react-query";

export const eitherAsyncToQueryFn = <T>(input: EitherAsync<unknown, T>): () => Promise<T> =>
    async () => (await input.run()).mapLeft(console.error).unsafeCoerce()

export type Mutation = UseMutationResult<unknown, unknown, void>


// forrasmegjeloles: https://medium.com/@achronus/solving-a-niche-frontend-problem-dynamic-tailwind-css-classes-in-react-da5f513ecf6a
enum ButtonColors {
    "primary",
    "danger",
}

export const buttonColors = Object.values(ButtonColors);
export type ButtonColorType = keyof typeof ButtonColors;

export const days: ReadonlyArray<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']