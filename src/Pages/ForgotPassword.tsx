import { useState } from "react";
import Button from "../Components/Button";
import Header from "../Components/Header";
import Input from "../Components/Input";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const forgotPassword = async () => {
        if (!email) {
            toast.error('Por favor, preencha o campo de email.');
            return;
        }

        setIsLoading(true);

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}user/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
        } else {
            toast.error('Ocorreu um erro ao enviar o email de recuperação. Tente novamente.');
        }
        setIsLoading(false);
    }

    return ( 
        <div className="h-screen max-w-3xl mx-auto p-6">
            <Header />
            <h1 className="text-3xl font-bold my-6">Esqueci minha senha</h1>
            <p className="text-gray-400 mb-6">Digite seu email para receber as instruções de recuperação de senha.</p>
            
            <form className="mt-20">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    setValue={setEmail}
                    placeholder="Digite seu email"
                />
                <Button type="button" onClick={forgotPassword} isLoading={isLoading}>Enviar email de recuperação</Button>
            </form>
        </div>
    );
}