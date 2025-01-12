import { TextInputProps } from "./TextInput.tsx";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Props for TextInputWithButton
 */
type TextInputWithButtonProps = TextInputProps & {
  /**
   * Icon for the button
   */
  buttonIcon?: IconProp;
  /**
   * Function to be called when the button is clicked
   */
  onClick?: () => void;
};

/**
 * Text input with a button (e.g. hide/show password)
 * @param value
 * @param onChange
 * @param type
 * @param disabled
 * @param placeholder
 * @param label
 * @param required
 * @param buttonIcon
 * @param onClick
 */
const TextInputWithButton = ({
                               value,
                               onChange,
                               type,
                               disabled,
                               placeholder,
                               label,
                               required,
                               buttonIcon,
                               onClick
                             }: TextInputWithButtonProps) => {
  return (
    <div className="flex flex-col justify-between gap-2 w-full">
      <label>{label}</label>
      <div className="w-full relative">
        <input
          type={type}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          placeholder={placeholder}
          required={required}
          className="border-2 rounded border-primary-faded focus:border-primary focus:outline-0 py-1 px-2 w-full"
        />
        {buttonIcon && onClick && (
          <FontAwesomeIcon
            icon={buttonIcon}
            className="absolute right-0 top-0 h-5 py-2 px-2 text-primary cursor-pointer"
            onClick={onClick}
            tabIndex={0}
          />
        )}
      </div>
    </div>
  );
};

export default TextInputWithButton;
