import { ReactNode } from "react";
import { ButtonColorType } from "../../utils.ts";

/**
 * Props for the Button component.
 */
export type ButtonProps = {
  /**
   * The content of the button.
   */
  children?: ReactNode;
  /**
   * The function to call when the button is clicked.
   */
  onClick?: () => void;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * The color of the button.
   */
  color?: ButtonColorType;
  /**
   * Extra CSS classes to apply to the button
   */
  extraCss?: string;
};

/**
 * A button component.
 * @param children
 * @param onClick
 * @param disabled
 * @param extraCss
 * @param color
 */
const Button = ({
                  children,
                  onClick,
                  disabled,
                  extraCss,
                  color = "primary"
                }: ButtonProps): JSX.Element => {
  return (
    <button
      className={
        `px-4 py-1.5 border-2 rounded bg-${color} text-light disabled:bg-light disabled:border-${color} disabled:text-${color} transition-colors hover:bg-${color}-hover ` +
        extraCss
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
