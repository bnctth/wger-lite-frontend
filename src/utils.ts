import { EitherAsync } from "purify-ts";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Converts an EitherAsync to a query function which logs then throws the error if the EitherAsync is a Left
 * @param input The EitherAsync to convert
 */
export const eitherAsyncToQueryFn =
  <T>(input: EitherAsync<unknown, T>): (() => Promise<T>) =>
    async () =>
      (await input.run()).mapLeft(console.error).unsafeCoerce();

/**
 * Convenience type for a mutation which doesn't require any arguments
 */
export type Mutation = UseMutationResult<unknown, unknown, void>;

// forrasmegjeloles: https://medium.com/@achronus/solving-a-niche-frontend-problem-dynamic-tailwind-css-classes-in-react-da5f513ecf6a
/**
 * A type representing the possible colors for a button
 */
enum ButtonColors {
  "primary",
  "danger",
  "unimportant",
}

/**
 * An array of the possible colors for a button
 */
export const buttonColors = Object.values(ButtonColors);
/**
 * A type representing the possible colors for a button
 */
export type ButtonColorType = keyof typeof ButtonColors;

// forrasmegjeloles vege

/**
 * An array of the possible days of the week
 */
export const days: ReadonlyArray<string> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
/**
 * An array of the possible impressions
 */
export const impressions = ["Bad", "Neutral", "Good"];
