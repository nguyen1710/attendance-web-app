import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter} from "react-router-dom";
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_GG_CLIENT_ID
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={clientId}>
      <App />

    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
