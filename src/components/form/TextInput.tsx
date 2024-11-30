import TextInputWithButton from "./TextInputWithButton.tsx";
import {HTMLInputTypeAttribute} from "react";

export type TextInputProps = {
    label: string,
    placeholder: string,
    value: string,
    onChange: (newValue: string) => void,
    type?: HTMLInputTypeAttribute,
    disabled?: boolean,
    required?: boolean
}


const TextInput = (props: TextInputProps) => TextInputWithButton(props)

export default TextInput