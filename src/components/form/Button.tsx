import {ReactNode} from "react";

export type ButtonProps = {
    children?: ReactNode, onClick?: () => void, disabled?: boolean
}

const Button = ({children, onClick, disabled}: ButtonProps) => {
    return <button
        className="px-4 py-1.5 border-2 rounded bg-primary text-light disabled:bg-light disabled:border-primary disabled:text-primary transition-colors hover:bg-primary-hover"
        onClick={onClick} disabled={disabled}>{children}</button>
}
export default Button