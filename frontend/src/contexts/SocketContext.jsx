// create a context for socket.io
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GFG_ROUTES } from '../gfgRoutes/gfgRoutes';
const SocketContext = createContext();
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user might not be logged in');
      return;
    }

    const newSocket = io(GFG_ROUTES.SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    

    newSocket.on('connect', () => {
  
      console.log('Connected to socket.io server');
      console.log(newSocket.id); // Log the socket ID
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });
    newSocket.on('welcome', (message) => {
      console.log(message); // Log the welcome message
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

