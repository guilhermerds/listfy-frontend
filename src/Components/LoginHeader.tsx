import { Link } from "react-router-dom";
import "../Css/LoginHeader.css"
import icon from "../Assets/Logo-Listfy.png"
import { MoreVert, ArrowBackIosNew } from '@mui/icons-material';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
    returnPath?: string;
    subtitle?: string;
    MenuContent?: React.ElementType;
}

const Header = ({ returnPath, subtitle, MenuContent }: Props) => {
    return (
        <header className="m-6" id="login-header">
            <div className="return-button">
                {returnPath && (
                    <Link to={returnPath!}>
                        <ArrowBackIosNew className="text-white" />
                    </Link>
                )}
            </div>
            <div className="branding">
                <Link to="/lists">
                    <img src={icon} alt="Listfy Ícone" />
                    <h3>{subtitle}</h3>
                </Link>
            </div>
            <div className="text-right">
                {MenuContent && (
                    <FlyoutLink href="#" FlyoutContent={MenuContent}>
                        <MoreVert className="text-white" />
                    </FlyoutLink>
                )}
            </div>
        </header>
    );
}

const FlyoutLink = ({
    children,
    href,
    FlyoutContent
}: {
    children: React.ReactNode;
    href: string;
    FlyoutContent?: React.ElementType;
}) => {
    const [open, setOpen] = useState(false);

    const showFlyout = FlyoutContent && open;

    return (
        <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="relative"
        >
            <a href={href} className="relative text-white">
                {children}
            </a>
            <AnimatePresence>
                {showFlyout && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        style={{ translateX: "-50%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute left-1/2 top-12"
                    >
                        <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
                        <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
                        <FlyoutContent />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;