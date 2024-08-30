import { combineReducers } from "redux";
import thunk from "redux-thunk";
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import dashboardReducer from './reducers/dashboard';
import messageReducer from './reducers/message';

const reducers = combineReducers({
    user: userReducer,
    dashboard: dashboardReducer,
    message: messageReducer
})

const storeConfig = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default storeConfig