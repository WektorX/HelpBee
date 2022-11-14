import { english } from "../../language/english";
import { polish } from "../../language/polish";

const initialState = {
    language: polish,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LANGUAGE_POLISH':
            return {
                ...state,
                language: polish,
            };
        case 'LANGUAGE_ENGLISH':
            return {
                ...state,
                language: english,
            };
        default:
            return state;
    }
};