export const userAuth = (user) => {
    return {
        type: 'USER_AUTH',
        userAuth: user,
    };
};

export const userEmail = (email) => {
    return {
        type: 'USER_EMAIL',
        email: email,
    };
};

export const userFirstName = (firstName) => {
    return {
        type: 'USER_FIRST_NAME',
        firstName: firstName,
    };
};

export const userLastName = (lastName) => {
    return {
        type: 'USER_LAST_NAME',
        lastName: lastName,
    };
};

export const userPhoneNumber = (phoneNumber) => {
    return {
        type: 'USER_PHONE_NUMER',
        phoneNumber: phoneNumber,
    };
};

export const userBirthDate = (birthDate) => {
    return {
        type: 'USER_BIRTH_DATE',
        birthDate: birthDate,
    };
};


export const userUID = (uid) => {
    return {
        type: 'USER_UID',
        uid: uid,
    };
};

export const userLocation = (location) => {
    return {
        type: 'USER_LOCATION',
        location: location,
    };
};

export const userOffers = (offers) =>{
    return {
        type: 'USER_OFFERS',
        offers: offers
    }
}