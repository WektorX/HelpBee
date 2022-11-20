import { createStore, combineReducers } from 'redux';
import LanguageReducer from './reducers/languageReducer'
import userReducer from './reducers/userReducer'

const rootReducer = combineReducers({
    language: LanguageReducer,
    user: userReducer
});

export const store = createStore(rootReducer);