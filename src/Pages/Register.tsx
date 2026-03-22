import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Button from "../Components/Button";
import Input from "../Components/Input";
import Header from "../Components/Header";
import toast from "react-hot-toast";
import '../Css/Register.css';
import { Helmet } from "react-helmet";
import { publicApi } from "../Connection/Axios";

export const Register = () => {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_FRONTEND_URL;
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createAccount = async () => {
        if (!name || !email || !password || !confirmPassword) {
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

        try{
            const response  = await publicApi.post('user', { name, email, password });
            if (response.status === 201) {
                const data = response.data;

                if (data.accessToken) {
                    if ((window as any)?.gtag) {
                        (window as any).gtag('event', 'conversion', {
                            'send_to': 'AW-17891812629/SNzPCNHOgOobEJXKvdNC'
                        });
                    }

                    toast.dismiss();
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    navigate('/lists');
                }
                else {
                    toast.error('Erro ao criar conta, tente novamente mais tarde.');
                }
            }
            else {
                const errorData = response.data;
                switch (errorData.code) {
                    case 'EMAIL_ALREADY_EXISTS':
                        toast.error('O email fornecido já está em uso. Utilize outro email.');
                        break;
                    default:
                        toast.error(`Erro ao criar conta, confira os dados e tente novamente.`);
                        break;
                }
            }
        }
        catch (error: any) {
            const code = error.response?.data.code;
            switch (code) {
                case 'EMAIL_ALREADY_EXISTS':
                    toast.error('O email fornecido já está em uso. Utilize outro email.');
                    break;
                default:
                    toast.error(`Erro ao criar conta, confira os dados e tente novamente.`);
                    break;
            }
        }        
        setIsLoading(false);
    }

    return (
        <div id="register-page" className="px-6">
            <Helmet>
                <meta property="description" content="Crie sua conta gratuita no Listify em segundos. Comece agora a organizar suas compras de supermercado, dividir despesas e colaborar com quem mora com você." />
                <link rel="canonical" href={`${url}register`} />
            </Helmet>
            <Header />
            <h1 className="text-3xl font-bold my-6">Crie sua conta</h1>
            <form>
                <Input
                    label="Nome"
                    type="text"
                    name="name"
                    value={name}
                    setValue={setUsername}
                    placeholder="Nome completo" />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    setValue={setEmail}
                    placeholder="Seu email principal" />
                <Input
                    label="Senha"
                    type="password"
                    name="password"
                    value={password}
                    setValue={setPassword}
                    placeholder="Senha com no mínimo 8 caracteres" />
                <Input
                    label="Confirme sua senha"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    placeholder="Confirme sua senha" />
                <Button
                    className="text-black"
                    onClick={createAccount}
                    type="button"
                    isLoading={isLoading}>
                    Criar Conta
                </Button>
            </form>
            <footer className="text-sm mb-6">
                Já tem uma conta? <Link to="/login">Fazer Login</Link>
            </footer>
        </div>
    );
}