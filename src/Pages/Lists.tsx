import { useEffect, useState } from "react";
import LoginHeader from "../Components/LoginHeader";
import ListBar from "../Components/ListBar";
import AddIcon from '@mui/icons-material/Add';
import { Modal, Input, Button } from "../Components/Index";
import toast from "react-hot-toast";
import LoadingElement from "../Components/LoadingElement";
import { api } from "../Connection/Axios";

export type IList = {
    id: string;
    name: string;
    category: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export const Lists = () => {
    const [lists, setLists] = useState<IList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listName, setListName] = useState("");
    const [category, setCategory] = useState("");
    const [isLoadingPage, setIsLoadingPage] = useState(true);


    useEffect(() => {
        api.get('/lists').then(response => {
            if (response.status === 200) {
                setLists(response.data);
                setIsLoadingPage(false);
            }
        }).catch(() => {
            toast.error('Erro ao buscar as suas listas. Tente novamente mais tarde.');
            setIsLoadingPage(false);
        });
    }, []);

    const createList = async () => {
        if (listName.trim() === "" || category.trim() === "") {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        api.post('/lists', { name: listName, category }).then(response => {
            if (response.status === 201) {
                const newList: IList = response.data;
                setLists([...lists, newList]);
                toast.success('Lista criada com sucesso!');
            }
        }).catch(() => {
            toast.error('Erro ao criar a lista. Tente novamente.');
        });

        setListName("");
        setCategory("");
        setIsModalOpen(false);
    }

    return (
        <div id="lists-page" className="max-w-3xl mx-auto my-0 p-5 flex flex-col h-full overflow-hidden">
            <LoginHeader />
            <h1 className="text-3xl text-left font-bold my-6">Minhas Listas</h1>
            {lists.length > 0 ? (
                <div className="lists-container flex-1 overflow-y-auto">
                    {lists.map(list => (
                        <ListBar key={list.id} list={list} />
                    ))}
                </div>
            ) :
                isLoadingPage ?
                    <div className="flex-1 flex justify-center items-center">
                        <LoadingElement className="h-20 w-20" priority={false} />
                    </div>
                    :
                    <p className="flex-1 content-center text-lg">
                        Crie a sua primeira Lista para adicionar os itens de compra. Clique no botão a baixo para começar.
                    </p>
            }

            <button className="h-13 w-13 rounded-full text-secondary bg-primary ml-auto my-4 cursor-pointer" onClick={() => setIsModalOpen(true)}>
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