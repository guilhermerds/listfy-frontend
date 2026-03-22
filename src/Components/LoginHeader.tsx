import { Link, useNavigate } from "react-router-dom";
import icon from "../Assets/Logo-Listfy.png"
import { MoreVert, ArrowBackIosNew } from '@mui/icons-material';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IosShare, Send } from '@mui/icons-material';
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { api } from "../Connection/Axios";

type Props = {
    returnPath?: string;
    subtitle?: string;
    MenuContent?: React.ElementType;
    listId?: string
}

const Header = ({ returnPath, subtitle, MenuContent, listId }: Props) => {
    const url = import.meta.env.VITE_FRONTEND_URL;
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState("");

    const shareData = {
      title: "Compartilhe o link",
      text: `Estou compartilhando minha lista de compras com você no Listify. Acesse o link para ver e editar comigo: ${url}login`,
    };

    const shareList = async () => {
        try{
            const response = await api.post(`/lists/${listId}/share`, { shareEmail });

            if (response.status === 200) {
                setIsShareModalOpen(false);

                if (navigator.share) {
                    try {
                        await navigator.share(shareData);

                        toast.success('Compartilhado com sucesso!');
                    } catch (error) {
                        console.log('Erro ao compartilhar ou cancelado:', error);
                    }
                } else {
                    try {
                        await navigator.clipboard.writeText(shareData.text);

                        toast.success('Link Copiado! Compartilhe com o link.');
                    } catch {
                        toast.error('Não foi possível compartilhar automaticamente.');
                    }
                }

            }
            else {
                toast.error('Erro ao compartilhar a lista. Tente novamente mais tarde.')
            }
        } catch (error) {
            toast.error('Erro ao compartilhar a lista. Tente novamente mais tarde.')
        }
    }

    return (
        <header className="m-6 flex justify-center items-center" id="login-header">
            <div className="return-button">
                {returnPath && (
                    <Link to={returnPath!}>
                        <ArrowBackIosNew className="text-white" />
                    </Link>
                )}
            </div>
            <div className="branding flex-1">
                <Link to="/lists" className="flex flex-col items-center">
                    <img
                        className="h-9"
                        src={icon}
                        alt="Listify Ícone"
                    />
                    <h3>{subtitle}</h3>
                </Link>
            </div>
            {listId && (
                <div className="mx-6">
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => { setIsShareModalOpen(true); setShareEmail("") }}>
                        <IosShare className="text-primary" />
                    </button>
                </div>
            )}
            <div className="text-right">
                {MenuContent && (
                    <FlyoutLink href="#" FlyoutContent={MenuContent}>
                        <MoreVert className="text-white" />
                    </FlyoutLink>
                )}
            </div>
            <Modal open={isShareModalOpen} setOpen={setIsShareModalOpen}>
                <div className="mb-4 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold">Compartilhar a Lista</h2>

                    <Input
                        type="text"
                        name="shareEmail"
                        value={shareEmail}
                        setValue={setShareEmail}
                        label="Email do convidado"
                        placeholder="nome@exemplo.com" />

                    <Button className="mt-4" onClick={shareList}>
                        <Send className="text-secondary mr-2" />Convidar
                    </Button>
                </div>
            </Modal>
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