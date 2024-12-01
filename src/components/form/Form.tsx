import {MutableRefObject, ReactNode, useRef} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {UseMutationResult} from "@tanstack/react-query";
import LoadingIconButton from "./LoadingIconButton.tsx";
import ErrorBox from "../ErrorBox.tsx";

const Form = <TData, TError, TContext>({children, submitText, submitIcon, mutation, headingText, errorMessage}: {
    headingText?: string,
    errorMessage: string,
    children: ReactNode,
    submitText: string,
    submitIcon?: IconProp,
    mutation: UseMutationResult<TData, TError, void, TContext>
}) => {
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);

    return (
        <form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {
            event.preventDefault()
            mutation.mutate()
        }}>
            {headingText && <h1 className="text-lg">{headingText}</h1>}
            <ErrorBox enabled={mutation.isError}>
                {errorMessage}
            </ErrorBox>
            {children}
            <LoadingIconButton loading={mutation.isLoading} icon={submitIcon}
                               onClick={() => form.current?.requestSubmit()}>
                {submitText}
            </LoadingIconButton>
        </form>
    );
};

export default Form;