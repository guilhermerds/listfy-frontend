import type { ComponentProps } from "react";
import LoadingElement from "./LoadingElement";

interface Props extends ComponentProps<"button"> {
    priority?: boolean;
    isLoading?: boolean;
}

const Button = ({ className, children, type, priority = true, onClick, isLoading }: Props) => {
    return (
        <button
            className={`w-full h-12 my-4 p-3 text-sm font-bold rounded-2xl border-2 border-primary cursor-pointer
                ${priority ? 'bg-primary text-black' : ''} ${className}`}
            type={type}
            onClick={(e) => { if (onClick && !isLoading) onClick(e);}}
        >
            {isLoading ? <LoadingElement priority={priority} className="w-6 h-6 m-auto" /> : children}
        </button>
    );
}

export default Button;