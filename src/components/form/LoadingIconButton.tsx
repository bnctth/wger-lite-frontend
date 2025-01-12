import IconButton, { IconButtonProps } from "./IconButton.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

/**
 * Props for the LoadingIconButton component
 */
type LoadingIconButtonProps = {
  /** If the button is in a loading state */
  loading: boolean;
} & IconButtonProps;

/**
 * An IconButton that can be in a loading state, when loading is true the button will show a spinner instead of the children and will be disabled
 * @param loading
 * @param disabled
 * @param children
 * @param iconButtonProps
 */
const LoadingIconButton = ({
                             loading,
                             disabled,
                             children,
                             ...iconButtonProps
                           }: LoadingIconButtonProps) => {
  return (
    <IconButton disabled={disabled || loading} {...iconButtonProps}>
      {(loading && (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        )) ||
        children}
    </IconButton>
  );
};

export default LoadingIconButton;
