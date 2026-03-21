import { useState } from "react";
import { Button, Header, Input } from "../Components/Index";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get('token') ?? '';
    const userId = searchParams.get('userId') ?? '';

    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createAccount = async () => {
        if (!password || !confirmPassword) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        if (password.length < 8) {
            toast.error('A senha deve ter no mínimo 8 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }
        setIsLoading(true);
        console.log("Reset token: " + resetToken);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}user/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: password, token: resetToken, userId }),
        });

        if (response.ok) {
            toast.success('Senha redefinida com sucesso!');
            navigate('/login');
        } else {
            toast.error('Ocorreu um erro ao redefinir a senha. Tente novamente.');
            setIsLoading(false);
        }
    }

    return ( 
        <div className="h-screen max-w-3xl mx-auto p-6">
            <Header />
            <h1 className="text-3xl font-bold my-6">Redefinir minha senha</h1>
            <p className="text-gray-400 mb-6">Informe a sua nova senha abaixo e confirme.</p>
            
            <form className="mt-20">
                <Input
                    label="Nova senha"
                    type="password"
                    name="password"
                    value={password}
                    setValue={setPassword}
                    placeholder="Senha com no mínimo 8 caracteres" />
                <Input
                    label="Confirme sua nova senha"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    placeholder="Confirme sua senha" />
                <Button
                    // className="text-black"
                    onClick={createAccount}
                    type="button"
                    isLoading={isLoading}>
                    Redefinir senha
                </Button>
            </form>
        </div>
    );
}