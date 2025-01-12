import Button, { ButtonProps } from "./Button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

/**
 * Props for IconButton component
 */
export type IconButtonProps = {
  /**
   * Icon to display - optional
   */
  icon?: IconProp;
} & ButtonProps;

/**
 * IconButton component
 * @param icon
 * @param children
 * @param buttonProps
 * @constructor
 */
const IconButton = ({ icon, children, ...buttonProps }: IconButtonProps) => (
  <Button {...buttonProps}>
    <div className="flex justify-center items-center gap-2">
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </div>
  </Button>
);

export default IconButton;
