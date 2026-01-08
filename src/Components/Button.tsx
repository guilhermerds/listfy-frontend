import type { ComponentProps } from "react";
import "../Css/Button.css"

const Button = (props: ComponentProps<"button">) => {
    return ( 
        <button className="main-button" type={props.type} onClick={props.onClick}>{props.children}</button>
     );
}
 
export default Button;