import { useEffect, useState } from "react";
import LoginHeader from "../Components/LoginHeader";
import { useNavigate } from "react-router-dom";
import ListBar from "../Components/ListBar";
import AddIcon from '@mui/icons-material/Add';
import {Modal, Input, Button} from "../Components/Index";
import toast from "react-hot-toast";

export type IList = {
    id: string;
    name: string;
    category: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export const Lists = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState<IList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listName, setListName] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem('authToken');

        const fetchLists = fetch(`${baseUrl}lists`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        fetchLists.then(response => {
            if (response.ok) {
                return response.json();
            }
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }

            console.error('Failed to fetch lists');
        }).then((data: IList[]) => {
            setLists(data);

        }).catch(error => {
            console.error('Error fetching lists:', error);
        });
    }, []);

    const createList = async () => {
        if (listName.trim() === "" || category.trim() === "") {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${baseUrl}lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: listName,
                category: category
            })
        });

        if (response.ok) {
            const newList: IList = await response.json();
            setLists([...lists, newList]);
            toast.success('Lista criada com sucesso!');
        }
        else if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
        else {
            toast.error('Erro ao criar a lista. Tente novamente.');
        }

        setListName("");
        setCategory("");
        setIsModalOpen(false);
    }

    return (
        <div id="lists-page" className="max-w-3xl mx-auto my-0 p-5">
            <LoginHeader />
            <h1 className="text-3xl text-left font-bold my-6">Minhas Listas</h1>
            <div className="lists-container">
                {lists.map(list => (
                    <ListBar key={list.id} list={list} />
                ))}
            </div>
            <button className="h-[50px] w-[50px] rounded-full text-secondary bg-primary" onClick={() => setIsModalOpen(true)}>
                <AddIcon fontSize="large" />
            </button>

            <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                <div className="mb-4 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold">Criar Nova Lista</h2>

                    <Input
                        type="text"
                        name="listName"
                        value={listName}
                        setValue={setListName}
                        label="Nome da Lista"
                        placeholder="Digite o nome da lista" />

                    <Input
                        type="text"
                        name="category"
                        value={category}
                        setValue={setCategory}
                        label="Categoria"
                        placeholder="Digite a categoria da lista" />

                    <Button className="mt-4" onClick={createList}>
                        Criar Lista
                    </Button>
                </div>
            </Modal>
        </div>
    );
}