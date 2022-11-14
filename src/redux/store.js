import { createStore, combineReducers } from 'redux';
import LanguageReducer from './reducers/languageReducer'

const rootReducer = combineReducers({
    language: LanguageReducer
});

export const store = createStore(rootReducer);