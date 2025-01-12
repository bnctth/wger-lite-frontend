import TextInputWithButton from "./TextInputWithButton.tsx";
import { HTMLInputTypeAttribute } from "react";

/**
 * Props for TextInput component
 */
export type TextInputProps = {
  /**
   * Label for the input
   */
  label: string;
  /**
   * Placeholder for the input
   */
  placeholder: string;
  /**
   * Value of the input
   */
  value: string;
  /**
   * Function to call when the value of the input changes
   * @param newValue new value of the input
   */
  onChange: (newValue: string) => void;
  /**
   * Type of the input
   */
  type?: HTMLInputTypeAttribute;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is required
   */
  required?: boolean;
};

/**
 * Same as TextInputWithButton - without a button
 * @param props
 * @constructor
 */
const TextInput = (props: TextInputProps) => TextInputWithButton(props);

export default TextInput;
