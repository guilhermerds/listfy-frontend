import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Button from "../Components/Button";
import Input from "../Components/Input";
import Header from "../Components/Header";
import toast from "react-hot-toast";
import '../Css/Register.css';
import { Helmet } from "react-helmet";

export const Register = () => {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_FRONTEND_URL;
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const createAccount = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

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

        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const response = await fetch(`${baseUrl}user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;

            if (token) {
                toast.dismiss();
                localStorage.setItem('authToken', token);
                navigate('/lists');
            }
            else {
                toast.error('Erro ao criar conta, tente novamente mais tarde.');
            }
        }
        else {
            const errorData = await response.json();
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

    return (
        <div id="register-page" className="px-6">
            <Helmet>
                <meta property="og:description" content="Crie sua conta gratuita no Listfy em segundos. Comece agora a organizar suas compras de supermercado, dividir despesas e colaborar com quem mora com você." />
                <link rel="canonical" href={`${url}login`} />
            </Helmet>
            <Header />
            <h1 className="text-3xl font-bold my-6">Crie sua conta</h1>
            <form onSubmit={createAccount}>
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
                <Button className="text-black" type="submit">Registrar</Button>
            </form>
            <footer>Já tem uma conta? <Link to="/login">Entrar</Link></footer>
        </div>
    );
}