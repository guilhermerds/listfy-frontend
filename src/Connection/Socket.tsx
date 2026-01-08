import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_WEBSOCKET_URL;

export const socket = io(URL, {
    autoConnect: false,
    auth: {
        token: localStorage.getItem('authToken')
    }
});