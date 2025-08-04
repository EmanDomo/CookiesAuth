import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="24911785473-h09j5rnh50dulcltf09mua8c6l42nkrh.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);