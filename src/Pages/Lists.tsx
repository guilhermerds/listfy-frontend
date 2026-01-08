import { useEffect, useState } from "react";
import Header from "../Components/Header"
import { Link, useNavigate } from "react-router-dom";
import "../Css/Lists.css"

type IList = {
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
            setLists(lists.filter(list => list.id !== id));
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
            <h2>Your Lists</h2>
            <div className="lists-container">
                {lists.map(list => (
                    <div className="list" key={list.id}>
                        <Link className="list-link" to={`/lists/${list.id}`} key={list.id}>
                            <h3>{list.name}</h3>
                            <p>{list.category}</p>
                        </Link>
                        <div className="list-toolbox">
                            <button><Link to={`/lists/${list.id}/edit`}>Edit</Link></button>
                            <button onClick={() => deleteList(list.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="create-list-button" onClick={() => navigate('/lists/create')}>+</button>
        </div>
    );
}