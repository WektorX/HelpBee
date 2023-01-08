import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000'
// const baseURL = 'http://192.168.0.20:3000'
// const baseURL = 'http://192.168.1.107:3000';



async function insertBasicUserData(id, user) {
    try {
        const res = await axios.post(`${baseURL}/api/users/fillInUserData`,
            {
                uid: id,
                birthDate: user.birthDate,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email
            },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }

}


async function updateUserLocation(id, location) {
    try {
        const res = await axios.post(`${baseURL}/api/users/setUserLocation`,
            {
                uid: id,
                location: location
            },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }

}


async function insertOffer(offer) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/insertOffer`,
            offer,
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }

}


async function withdrawOffer(id) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/withdrawOffer`,
            { id: id },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

async function closeOffer(id) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/closeOffer`,
            { id: id },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }

}


async function updateOffer(id, offer) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/updateOffer`,
            { id: id, offer: offer },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }

}

async function takeOffer(uid, offerID) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/takeOffer`,
            { uid: uid, offerID: offerID },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

async function resignFromOffer(uid, offerID) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/resignFromOffer`,
            { uid: uid, offerID: offerID },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

async function acceptWorker(id, workerID) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/acceptWorker`,
            { offerID: id, workerID: workerID},
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

async function rejectWorker(id, workerID) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/rejectWorker`,
            { offerID: id, workerID: workerID},
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}


async function reportOffer(uid, offerID) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/reportOffer`,
            { userID : uid , offerID: offerID},
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

async function insertRate(rating) {
    try {
        const res = await axios.post(`${baseURL}/api/ratings/insertRate`,
            { rating : rating},
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

export {
    insertBasicUserData,
    updateUserLocation,
    insertOffer,
    withdrawOffer,
    updateOffer,
    takeOffer,
    resignFromOffer,
    acceptWorker,
    rejectWorker,
    closeOffer,
    reportOffer,
    insertRate
}