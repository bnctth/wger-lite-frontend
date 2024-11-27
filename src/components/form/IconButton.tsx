import Button, {ButtonProps} from "./Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";


type IconButtonProps = { icon: IconProp } & ButtonProps

const IconButton = ({icon, children, ...buttonProps}: IconButtonProps) =>
    <Button {...buttonProps}>
        <div className="flex justify-between items-center gap-2">
            <FontAwesomeIcon className="text-light" icon={icon}/>
            {children}
        </div>
    </Button>

export default IconButton;