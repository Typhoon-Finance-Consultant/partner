import { configureStore } from '@reduxjs/toolkit';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';
import authReducer from './auth/authSlice';
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'root',
    storage,
};
const rootReducer = combineReducers({ auth: authReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {return [thunk]}
});

export const persistor = persistStore(store);
