import IconButton, {IconButtonProps} from "./IconButton.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

type LoadingIconButtonProps = { loading: boolean } & IconButtonProps

const LoadingIconButton = ({loading, disabled, children, ...iconButtonProps}: LoadingIconButtonProps) => {
    return (
        <IconButton disabled={disabled || loading} {...iconButtonProps}>
            {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin"/> || children}
        </IconButton>
    );
};

export default LoadingIconButton;