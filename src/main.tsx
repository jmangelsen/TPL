import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ViewModeProvider>
        <App />
      </ViewModeProvider>
    </BrowserRouter>
  </StrictMode>,
);
