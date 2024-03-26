import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import theme from './theme';

import { persistor, store } from './features/store';

if (import.meta.env.DEV) {
    window.onerror = (event, source, lineno, colno, err) => {
        // must be within function call because that's when the element is defined for sure.
        const ErrorOverlay = customElements.get('vite-error-overlay');
        // don't open outside vite environment
        if (!ErrorOverlay) {
            return;
        }
        const overlay = new ErrorOverlay(err);
        document.body.appendChild(overlay);
    };
}

const queryClient = new QueryClient({ contextSharing: true });

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <CssBaseline />
                        <App />
                    </PersistGate>
                </Provider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
