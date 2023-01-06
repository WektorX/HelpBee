const initialState = {
    userAuth: null,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: null,
    uid: '',
    location: { Latitude: 0, Longitude: 0 },
    offers: [],
    distance: 20,
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
            var date = action.birthDate;
            const _REGEX = new RegExp(/^[a-zA-Z]{3}\s[a-zA-Z]{3}\s[0-9]{2}\s[0-9]{4}$/);
            if (_REGEX.test(action.birthDate))
                try {
                    let temp_date = new Date(action.birthDate);
                    var day = temp_date.getDate() > 9 ? temp_date.getDate() : "0" + temp_date.getDate();
                    var month = temp_date.getMonth() > 9 ? temp_date.getMonth() : "0" + temp_date.getMonth();
                    var year = temp_date.getFullYear();
                    date = day + "." + month + "." + year;
                }
                catch (e) {
                    console.log(e)
                }
            return {
                ...state,
                birthDate: date,
            };
        case 'USER_UID':
            return {
                ...state,
                uid: action.uid,
            };
        case 'USER_LOCATION':
            return {
                ...state,
                location: action.location,
            };
        case 'USER_OFFERS':
            return {
                ...state,
                offers: action.offers
            };
        case 'USER_DISTANCE':
            return {
                ...state,
                distance: action.distance
            }
        default:
            return state;
    }
};