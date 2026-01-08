import { Link } from "react-router-dom";

type Props = {

}

export const Home = ({ }: Props) => {
    return (
        <main>
            <h1>Listfy</h1>
            <p>Bem-vindo à vida mais simples com Listfy!</p>

            <p><Link to="/register">Criar Conta</Link></p>
            <p><Link to="/login">Entrar</Link></p>
        </main>
    );
}