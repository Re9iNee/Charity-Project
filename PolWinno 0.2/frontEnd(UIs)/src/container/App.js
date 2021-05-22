import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'

import Charity from "./Charity";


function App() {
  return (
    <BrowserRouter>
      <Charity />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
