import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Theme/Sidebar";
import logoicon from '../../assets/images/LogoHCMIU.svg';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../../redux/userSlice';
import { RootState } from '../../redux/store'; // Import RootState type

function MessagePage() {  
  const user = useSelector((state: RootState) => state.user); // Specify RootState type
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  /***socket connection */
  useEffect(() => {
    
        
        const token = localStorage.getItem('token'); // Retrieve token from localStorage or another storage method

    if (!token) {
      console.error("Token is missing. Please log in again.");
    } else {
      console.log("Token found:", token); // Log the token for debugging
    }

const socketConnection = io('http://localhost:3300', {
  transports: ['websocket'],
  withCredentials: true,
  auth: {
    token: token, // Send the token with the connection
  },
});


    socketConnection.on('connect', () => {
      console.log('Connected to Socket.IO server with ID:', socketConnection.id);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  // Check if we are at the base path of /message/:id
  const isBasePath = location.pathname === `/message/${id}`;
  const isChatPath = location.pathname === `/message/${id}/chat`;

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* Sidebar Section */}
      <section className="bg-white lg:block">
        <Sidebar />
      </section>

      {/* Default Logo and Text Section */}
      {isBasePath && (
        <div className="flex justify-center items-center flex-col gap-2">
          <img src={logoicon} width={250} alt="logoicon" />
          <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
        </div>
      )}

      {/* Chat Content Section */}
      {isChatPath && (
        <section className="w-full h-full">
          <Outlet />
        </section>
      )}
    </div>
  );
}

export default MessagePage;
