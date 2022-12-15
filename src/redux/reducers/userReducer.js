const initialState = {
    userAuth: null,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: null,
    uid: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'USER_AUTH':
            return {
                ...state,
                userAuth: action.userAuth,
            };
        case 'USER_EMAIL':
            return {
                ...state,
                email: action.email,
            };
        case 'USER_PHONE_NUMER':
            return {
                ...state,
                phoneNumber: action.phoneNumber,
            };
        case 'USER_FIRST_NAME':
            return {
                ...state,
                firstName: action.firstName,
            };
        case 'USER_LAST_NAME':
            return {
                ...state,
                lastName: action.lastName,
            };
        case 'USER_BIRTH_DATE':
            return {
                ...state,
                birthDate: action.birthDate,
            };
        case 'USER_UID':
            return {
                ...state,
                uid: action.uid,
            };
        default:
            return state;
    }
};