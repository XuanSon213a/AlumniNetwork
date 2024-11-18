import React from 'react';
import { Outlet } from 'react-router-dom';
import Page from './Components/Page';

function App() {4
  
  return (
    <>
      <Page />
      {/* Outlet to render child components based on the current route */}
      <Outlet />
    </>
  );
}

export default App;
