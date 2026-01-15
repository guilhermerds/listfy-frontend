import type { ComponentProps } from "react";
import "../Css/Button.css"

interface Props extends ComponentProps<"button"> {
    priority?: boolean
}

const Button = ({ className, children, type, priority = true, onClick }: Props) => {
    return (
        <button
            className={`w-full my-4 p-3 text-sm font-bold rounded-2xl border-2 border-primary cursor-pointer
                ${priority ? 'bg-primary text-black' : ''} ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;