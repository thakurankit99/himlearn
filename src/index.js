import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthContextProvider from './Context/AuthContext';
import './styles/tailwind.css';
import axios from 'axios';
import { apiConfig } from './config/api.js';

// Set default base URL for all Axios requests
axios.defaults.baseURL = apiConfig.baseURL;

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
       <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);