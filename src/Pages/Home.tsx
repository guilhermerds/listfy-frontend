import { useNavigate } from "react-router-dom";
import ShoppingCart from "../Assets/ShoppingCart.png"
import ListfyLogo from "../Assets/Logo-Listfy.png"
import Button from "../Components/Button";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col h-screen max-w-3xl mx-auto p-6">
            <div className="relative flex flex-col items-center">
                <img
                    src={ShoppingCart}
                    className="rounded-3xl max-h-96"
                    alt="Imagem do carrinho de compras cheio" />
                <div
                    className="p-4 absolute bottom-0 w-fit bg-secondary rounded-3xl 
                        border border-gray-500">
                    <img
                        src={ListfyLogo}
                        className="h-9"
                        alt="Logo Listfy" />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="font-bold text-3xl my-6">Boas-vindas ao <span className="text-primary">Listify</span></h1>
                <p className="text-lg text-gray-400">
                    Simplifique suas compras. <br />
                    Organize sua rotina em segundos e nunca mais esqueça um item.
                </p>
            </div>
            <div>
                <Button onClick={() => { navigate("/register") }}>
                    Criar Conta
                </Button>
                <Button onClick={() => { navigate("/login") }} priority={false}>
                    Entrar
                </Button>
            </div>
            {/* 
            <p><Link to="/register">Criar Conta</Link></p>
            <p><Link to="/login">Entrar</Link></p> */}
        </main>
    );
}