import { english } from "../../Language/english";
import { polish } from "../../Language/polish";

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