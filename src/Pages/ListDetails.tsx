import { useEffect, useState } from "react";
import Header from "../Components/Header"
import { useNavigate } from "react-router-dom";
import { socket } from "../Connection/Socket";

type IListItem = {
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
    const navigate = useNavigate();
    let [listName, setListName] = useState("");
    let [listItens, setListItens] = useState<IListItem[]>();
    let [isSocketConnected, setIsSocketConnected] = useState(false);

    const connectWS = () => {
        if (isSocketConnected) {
            console.log("WebSocket already connected");
            return;
        }

        setIsSocketConnected(true);

        const listId = window.location.pathname.split("/")[2];

        socket.on("connect", () => {
            console.log("WebSocket connected");
            //socket.emit("joinListRoom", { listId });
        });

        socket.on("listUpdated", (data: ISocketMessage) => {
            console.log("Item updated:", data);

            // Atualize o estado dos itens da lista conforme necessário
            switch (data.type) {
                case 'ITEM-ADDED':
                    //Não permite que tenha itens duplicados
                    setListItens((prevItems) => {
                        const uniqueItems = new Set(prevItems?.map(item => item.id));
                        if (uniqueItems.has(data.item.id)) {
                            return prevItems;
                        }
                        return [...(prevItems || []), data.item];
                    });
                    break;
                case 'ITEM-UPDATED':
                    setListItens((prevItems) => prevItems?.map(item => item.id === data.item.id ? data.item : item) || []);
                    break;
                case 'ITEM-DELETED':
                    setListItens((prevItems) => prevItems?.filter(item => item.id !== data.item.id) || []);
                    break;
            }

            console.log("Updated list items:", listItens);
        });

        socket.connect();

        socket.emit("joinList", listId);
    }

    useEffect(connectWS, []);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem('authToken');
        const listId = window.location.pathname.split("/")[2];

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
                    window.location.href = '/login';
                }
            })
            .then((data: IListItem[]) => {
                setListItens(data);
            });
    }, []);

    const updateItem = (itemId: string, isDone: boolean) => {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem('authToken');
        const listId = window.location.pathname.split("/")[2];

        fetch(`${baseUrl}lists/${listId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isDone })
        })
            .then(response => {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
            });
    }

    const deleteList = async (id: string) => {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${baseUrl}lists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            navigate('/lists');
        }
        else if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
        else {
            console.error('Failed to delete list');
        }
    }

    return (
        <div>
            <Header />
            <h2>{listName}</h2>
            <ul>
                {listItens?.map((item, index) => (
                    <li key={index}>
                        <input type="checkbox" name={item.id} id={item.id} defaultChecked={item.isDone}
                            onClick={(e) => {
                                updateItem(item.id, e.currentTarget.checked);
                            }} />
                        <div className="item-details">
                            <div className="item-info">
                                <p>{item.name}</p>
                                <p>{item.amount}</p>
                            </div>
                            <div className="item-price">
                                <p>${item.price}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}