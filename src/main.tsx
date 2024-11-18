import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store.tsx';

// Import route components
import Admin from './Admin';
import Import from './Components/AluminiList/Import';
import Individuals from './Components/AluminiList/Individuals';
import SignIn from './Components/Login/SignIn';
import SignUp from './Components/Register/SignUp';
import MessagePage from './Components/Message/MessagePage.tsx';
import ChatBox from './Components/Message/Theme/ChatBox.tsx';

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/logout",
    element: <SignIn />,
  },
  {
    path: "/inv",
    element: <Individuals />,
  },
  {
    path: "/inv/login",
    element: <SignIn />,
  },
  {
    path: "/inv/register",
    element: <SignUp />,
  },
  {
    path: "/news",
    element: <Import />,
  },{
    path : "/message/:id",
    element : <MessagePage/>,
    children : [
        {
            path : "chat",
            element : <ChatBox/>
  }]}
]);

// Render the root component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
