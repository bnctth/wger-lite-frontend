import {ReactNode} from "react";
import {ButtonColorType} from "../../utils.ts";

export type ButtonProps = {
    children?: ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    color?: ButtonColorType,
    extraCss?: string
}

const Button = ({
                    children,
                    onClick,
                    disabled,
                    extraCss,
                    color = "primary",
                }: ButtonProps) => {
    return <button
        className={`px-4 py-1.5 border-2 rounded bg-${color} text-light disabled:bg-light disabled:border-${color} disabled:text-${color} transition-colors hover:bg-${color}-hover ` + extraCss}
        onClick={onClick} disabled={disabled}>{children}</button>
}
export default Button