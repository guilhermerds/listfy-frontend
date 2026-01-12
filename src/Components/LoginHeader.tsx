import { Link } from "react-router-dom";
import "../Css/LoginHeader.css"
import icon from "../Assets/Logo-Listfy.png"
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MoreVert, ArrowBackIosNew } from '@mui/icons-material';

type Props = {
    returnPath?: string;
    subtitle?: string;
    onSettingsClick?: () => void;
}

const Header = ({ returnPath, subtitle = "Lista de compras de setembro ", onSettingsClick }: Props) => {
    return (
        <header id="login-header">
            <div className="return-button">
                {returnPath && (
                    <Link to={returnPath!}>
                        <ArrowBackIosNew sx={{ color: '#fff' }} />
                    </Link>
                )}
            </div>
            <div className="branding">
                <Link to="/lists">
                    <img src={icon} alt="Listfy Ícone" />
                    <h3>{subtitle}</h3>
                </Link>
            </div>
            <div className="settings">
                {onSettingsClick && (
                    <button onClick={onSettingsClick}>
                        <MoreVert sx={{ color: '#fff' }} />
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;