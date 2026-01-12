import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Button from "../Components/Button";
import Input from "../Components/Input";
import toast from "react-hot-toast";
import '../Css/Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        const baseUrl = import.meta.env.VITE_SERVER_URL;
        try {
            const response = await fetch(`${baseUrl}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
                    toast.error('Erro ao fazer login, tente novamente mais tarde.');
                }
            }
            else {
                const errorData = await response.json();
                switch (errorData.code) {
                    case 'EMAIL_PASSWORD_INCORRECT':
                        toast.error('Email ou senha inválidos. Tente novamente.');
                        break;
                    default:
                        toast.error('Erro ao fazer login, tente novamente mais tarde.');
                        break;
                }
            }
        }
        catch (error) {
            toast.error('Erro ao fazer login, tente novamente mais tarde.');
        }
    }

    return (
        <div id="login-page">
            <Header />
            <h1 className="text-3xl font-bold my-6">Bem-vindo de volta!</h1>
            <form id="login-form" onSubmit={login}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    setValue={setEmail}
                    placeholder="Digite seu email"
                />
                <Input
                    label="Senha"
                    type="password"
                    name="password"
                    value={password}
                    setValue={setPassword}
                    placeholder="Digite sua senha"
                />
                <Button type="submit">Login</Button>
            </form>
            <footer>Não tem uma conta? <Link to="/register">Crie uma agora</Link></footer>
        </div>
    );
}