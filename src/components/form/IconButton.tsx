import Button, {ButtonProps} from "./Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";


export type IconButtonProps = { icon?: IconProp } & ButtonProps

const IconButton = ({icon, children, ...buttonProps}: IconButtonProps) =>
    <Button {...buttonProps}>
        <div className="flex justify-center items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon}/>}
            {children}
        </div>
    </Button>

export default IconButton;