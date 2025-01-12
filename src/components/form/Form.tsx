import { MutableRefObject, ReactNode, useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import LoadingIconButton from "./LoadingIconButton.tsx";
import ErrorBox from "../list-pages/ErrorBox.tsx";
import { Mutation } from "../../utils.ts";

/**
 * Form component
 * @param children - mostly input elements
 * @param submitText - text on the submit button
 * @param submitIcon - icon on the submit button
 * @param mutation - mutation to be called on submit
 * @param headingText - optional heading text
 * @param errorMessage - error message to be displayed on error
 */
const Form = ({
                children,
                submitText,
                submitIcon,
                mutation,
                headingText,
                errorMessage
              }: {
  headingText?: string;
  errorMessage: string;
  children?: ReactNode;
  submitText: string;
  submitIcon?: IconProp;
  mutation: Mutation;
}) => {
  const form: MutableRefObject<HTMLFormElement | null> = useRef(null);

  return (
    <form
      ref={form}
      className="w-full flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        mutation.mutate();
      }}
    >
      {headingText && <h1 className="text-lg">{headingText}</h1>}
      <ErrorBox enabled={mutation.isError}>{errorMessage}</ErrorBox>
      {children}
      <LoadingIconButton loading={mutation.isLoading} icon={submitIcon}>
        {submitText}
      </LoadingIconButton>
    </form>
  );
};

export default Form;
