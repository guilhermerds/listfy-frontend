import { Link } from "react-router-dom";
import "../Css/Header.css"
import icon from "../Assets/Logo-Listfy.png"

const Header = () => {
    return ( 
        <header>
            <Link to="/">
                <img src={icon} alt="Listfy Ícone" />
            </Link>
        </header>
    );
}
 
export default Header;