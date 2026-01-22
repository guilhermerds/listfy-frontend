import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../Connection/Socket";
import { Button, Input, LoginHeader, Modal } from "../Components/Index";
import toast from "react-hot-toast";
import AddIcon from '@mui/icons-material/Add';
import formatCurrency from "../Utils/Currency";
import DeleteIcon from '@mui/icons-material/Delete';
import ItemBar from "../Components/ItemBar";
import LoadingElement from "../Components/LoadingElement";


export type IListItem = {
    id: string;
    name: string;
    price: number;
    amount: number;
    isDone: boolean;
}

type ISocketMessage = {
    item: IListItem;
    type: 'ITEM-ADDED' | 'ITEM-UPDATED' | 'ITEM-DELETED';
}

export const ListDetails = () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('authToken');
    const { id } = useParams();
    const listId = id || "";

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [listName, setListName] = useState("");
    const [category, setCategory] = useState("");
    const [editListName, setEditListName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [listItens, setListItens] = useState<IListItem[]>([]);
    const [isModalEditListOpen, setIsModalEditListOpen] = useState(false);
    const [isModalCreateItemOpen, setIsModalCreateItemOpen] = useState(false);
    const [isModalEditItemOpen, setIsModalEditItemOpen] = useState(false);
    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("");
    const [itemAmount, setItemAmount] = useState("");
    const [itemPrice, setItemPrice] = useState("");

    useEffect(() => {
        // 1. Atualiza o token na instância do socket antes de conectar
        // Isso garante que, se acabou de logar, o socket vá autenticado
        if (token) {
            socket.auth = { token };
        }

        const handleJoinRoom = () => {
            console.log(`Entrando na sala: ${listId}`);
            // toast.success("Conectado a lista"); // Evite toast aqui para não duplicar em dev
            socket.emit("joinList", listId);
        };

        const handleListUpdated = (data: ISocketMessage) => {
            console.log("Item updated:", data);

            setListItens((prevItems) => {
                const currentItems = prevItems || [];

                switch (data.type) {
                    case 'ITEM-ADDED':
                        // Verifica duplicidade para evitar itens repetidos
                        const exists = currentItems.some(item => item.id === data.item.id);
                        if (exists) return currentItems;
                        return [...currentItems, data.item];

                    case 'ITEM-UPDATED':
                        return currentItems.map(item => item.id === data.item.id ? data.item : item);

                    case 'ITEM-DELETED':
                        return currentItems.filter(item => item.id !== data.item.id);

                    default:
                        return currentItems;
                }
            });
        };

        // 2. Lógica de Conexão Robustas
        if (!socket.connected) {
            socket.connect();
        } else {
            // Se já estava conectado, força a entrada na sala
            handleJoinRoom();
        }

        // 3. Listeners
        socket.on("connect", handleJoinRoom);
        socket.on("listUpdated", handleListUpdated);

        // 4. Cleanup (Desmontagem do componente)
        return () => {
            console.log("Saindo da tela da lista...");

            // REMOVE os listeners específicos dessa tela
            socket.off("connect", handleJoinRoom);
            socket.off("listUpdated", handleListUpdated);

            // IMPORTANTE: Não desconecte o socket global, apenas saia da sala
            // Se seu backend tiver o evento 'leaveList', use-o. 
            // Se não tiver, apenas remover o listener 'listUpdated' já previne o update de estado
            socket.emit("leaveList", listId);

            // NÃO use socket.disconnect() aqui se for um SPA (Single Page Application)
        };
    }, [listId, token]);

    useEffect(() => {
        fetch(`${baseUrl}lists/${listId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            })
            .then(data => {
                setListName(data.name);
                setCategory(data.category);
            });

        fetch(`${baseUrl}lists/${listId}/items`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            })
            .then((data: IListItem[]) => {
                setListItens(data);
                setIsLoadingPage(false);
            });
    }, []);

    const updateItemIsDone = (itemId: string, isDone: boolean) => {
        fetch(`${baseUrl}lists/${listId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isDone })
        })
            .then(async (response) => {
                if (response.status === 200) {
                    const data: IListItem = await response.json();

                    setListItens((prevItems) => {
                        const currentItems = prevItems || [];

                        return currentItems.map(item => item.id === data.id ? data : item);
                    });
                }
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            });
    }

    const createItem = () => {
        if (itemName.trim() === "" || itemPrice.trim() === "" || itemAmount.trim() === "") {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setIsLoading(true);

        const amount = Number(itemAmount);
        const price = parseFloat(itemPrice.replace(".", "").replace(",", "."));

        fetch(`${baseUrl}lists/${listId}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName, price, amount, isDone: false })
        })
            .then(async (response) => {
                if (response.status == 201) {
                    const data: IListItem = await response.json();

                    setListItens((prevItems) => {
                        const currentItems = prevItems || [];

                        const exists = currentItems.some(item => item.id === data.id);

                        if (exists) return currentItems;

                        return [...currentItems, data];
                    });

                    toast.success("Item criado com Sucesso.");
                    setIsModalCreateItemOpen(false);
                }
                else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
                else {
                    toast.error("Não foi possível criar o item. Tente novamente mais tarde.")
                }

                setIsLoading(false)
            });
    }

    const editItem = () => {
        if (itemName.trim() === "" || itemPrice.trim() === "" || itemAmount.trim() === "") {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setIsLoading(true);

        const amount = Number(itemAmount);
        const price = Number(itemPrice.replace(".", "").replace(",", "."));

        fetch(`${baseUrl}lists/${listId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName, price, amount })
        })
            .then(async (response) => {
                if (response.status == 200) {
                    const data: IListItem = await response.json();

                    setListItens((prevItems) => {
                        const currentItems = prevItems || [];

                        return currentItems.map(item => item.id === data.id ? data : item);
                    });

                    toast.success("Item atualizado com Sucesso.");
                    setIsModalEditItemOpen(false);
                }
                else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
                else {
                    toast.error("Não foi possível atualizar o item. Tente novamente mais tarde.")
                }

                setIsLoading(false);
            });
    }

    const deleteItem = async () => {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}lists/${listId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setListItens((prevItems) => {
                const currentItems = prevItems || [];

                return currentItems.filter(item => item.id !== itemId);
            });

            toast.success('Item excluído com sucesso!');
            setIsModalEditItemOpen(false);
        }
        else if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
        else {
            toast.error('Erro ao excluir o Item. Tente novamente mais tarde.');
        }

        setIsLoading(false);
    }

    const editList = async () => {
        if (listName.trim() === "" || category.trim() === "") {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);

        const response = await fetch(`${baseUrl}lists/${listId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: editListName,
                category: editCategory
            })
        });

        if (response.ok) {
            setIsModalEditListOpen(false);
            setListName(editListName);
            setCategory(editCategory);
            toast.success('Lista atualizada com sucesso!');
        }
        else if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
        else {
            toast.error('Erro ao atualizar a lista. Tente novamente mais tarde.');
        }

        setIsLoading(false);
    }

    const deleteList = async () => {
        const response = await fetch(`${baseUrl}lists/${listId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            navigate('/lists');
            toast.success('Lista excluída com sucesso!');
        }
        else if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
        else {
            toast.error('Erro ao excluir a lista. Tente novamente mais tarde.');
        }
    }

    const ListMenu = () => {
        return (
            <div className="w-24 bg-secondary-light p-6 shadow-xl rounded-2xl">
                <div className="space-y-3 text-center">
                    <a onClick={() => { setEditListName(listName); setEditCategory(category); setIsModalEditListOpen(true) }} className="block text-sm hover:underline cursor-pointer text-white">
                        Editar lista
                    </a>
                    <a onClick={deleteList} className="block text-sm hover:underline cursor-pointer text-white">
                        Excluir lista
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-3xl mx-auto h-full overflow-hidden">
            <LoginHeader returnPath="/lists" subtitle={category} MenuContent={ListMenu} listId={listId} />
            <h1 className="text-3xl text-left font-bold my-6 ml-6">{listName}</h1>

            {listItens.length > 0 ?
                (
                    <ul className="flex-1 overflow-y-auto px-6">
                        {listItens?.map((item, index) => (
                            <ItemBar
                                key={index}
                                item={item}
                                onCheckClick={(e) => {
                                    updateItemIsDone(item.id, e.currentTarget.checked);
                                }}
                                onClick={() => {
                                    setIsModalEditItemOpen(true);
                                    setItemId(item.id);
                                    setItemName(item.name);
                                    setItemAmount(String(item.amount));
                                    setItemPrice(formatCurrency(item.price));
                                }}
                            />
                        ))}
                    </ul>
                )
                : (
                    isLoadingPage ?
                        <div className="flex-1 flex justify-center items-center">
                            <LoadingElement className="h-20 w-20" priority={false} />
                        </div>
                        :
                        <p className="flex-1 content-center m-6 h-full">
                            Não existem itens nesta lista. Adicione no botão a baixo!
                        </p>
                )
            }
            <button
                className="ml-auto mr-6 my-2 h-12 w-12 rounded-full text-secondary bg-primary cursor-pointer"
                onClick={() => {
                    setIsModalCreateItemOpen(true);
                    setItemId("")
                    setItemName("");
                    setItemAmount("1");
                    setItemPrice("0,00");
                }}>
                <AddIcon fontSize="large" />
            </button>
            <footer className="flex flex-row justify-between border-t border-gray-400 p-6">
                <div className="text-left">
                    <p className="text-sm text-gray-300">Estimado</p>
                    <p className="font-bold">
                        {formatCurrency(listItens.reduce((acc, item) => {
                            return acc + (item.price * item.amount);
                        }, 0), true)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-300">Comprado</p>
                    <p className="font-bold text-primary">
                        {formatCurrency(listItens.reduce((acc, item) => {
                            if (item.isDone) {
                                return acc + (item.price * item.amount);
                            }
                            return acc;
                        }, 0), true)}
                    </p>
                </div>
            </footer>
            <Modal open={isModalEditListOpen} setOpen={setIsModalEditListOpen}>
                <div className="mb-4 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold">Editar a Lista</h2>

                    <Input
                        type="text"
                        name="listName"
                        value={editListName}
                        setValue={setEditListName}
                        label="Nome da Lista"
                        placeholder="Digite o nome da lista" />

                    <Input
                        type="text"
                        name="category"
                        value={editCategory}
                        setValue={setEditCategory}
                        label="Categoria"
                        placeholder="Digite a categoria da lista" />

                    <Button
                        isLoading={isLoading}
                        className="mt-4"
                        onClick={editList}>
                        Salvar
                    </Button>
                </div>
            </Modal>
            <Modal open={isModalCreateItemOpen} setOpen={setIsModalCreateItemOpen}>
                <div className="mb-4 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold">Criar Item</h2>

                    <Input
                        type="text"
                        name="itemName"
                        value={itemName}
                        setValue={setItemName}
                        label="Nome do Item"
                        placeholder="Digite o nome do item" />

                    <Input
                        type="number"
                        name="itemAmount"
                        value={itemAmount}
                        setValue={setItemAmount}
                        label="Quantidade"
                        placeholder="Digite a quantidade" />

                    <Input
                        type="money"
                        name="price"
                        value={itemPrice}
                        setValue={setItemPrice}
                        label="Preço unitário"
                        placeholder="Digite o valor de 1 item" />


                    <div className="flex gap-3">
                        <Button
                            isLoading={isLoading}
                            priority={false}
                            className="mt-4"
                            onClick={() => { setIsModalCreateItemOpen(false) }}>
                            Cancelar
                        </Button>
                        <Button
                            isLoading={isLoading}
                            className="mt-4"
                            onClick={createItem}>
                            Salvar
                        </Button>
                    </div>

                </div>
            </Modal>
            <Modal open={isModalEditItemOpen} setOpen={setIsModalEditItemOpen}>
                <div className="mb-4 text-center max-w-3xl mx-auto">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold">Editar Item</h2>
                        <button type="button" className="cursor-pointer" onClick={deleteItem}>
                            <DeleteIcon />
                        </button>
                    </div>


                    <Input
                        type="text"
                        name="itemName"
                        value={itemName}
                        setValue={setItemName}
                        label="Nome do Item"
                        placeholder="Digite o nome do item" />

                    <Input
                        type="number"
                        name="itemAmount"
                        value={itemAmount}
                        setValue={setItemAmount}
                        label="Quantidade"
                        placeholder="Digite a quantidade" />

                    <Input
                        type="money"
                        name="price"
                        value={itemPrice}
                        setValue={setItemPrice}
                        label="Preço unitário"
                        placeholder="Digite o valor de 1 item" />

                    <div className="flex gap-3">
                        <Button
                            priority={false}
                            isLoading={isLoading}
                            className="mt-4"
                            onClick={() => { setIsModalEditItemOpen(false) }}>
                            Cancelar
                        </Button>
                        <Button
                            className="mt-4"
                            onClick={editItem}
                            isLoading={isLoading}>
                            Salvar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}