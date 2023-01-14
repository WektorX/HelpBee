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

async function setPreferences(uid, distance, preferences) {
    try {
        const res = await axios.post(`${baseURL}/api/users/setPreferences`,
            {
                uid: uid,
                distance: distance,
                preferences: preferences
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


async function withdrawOffer(id, title, worker, uid) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/withdrawOffer`,
            { id: id, title: title, workerID: worker, userID: uid },
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


async function restoreOffer(id) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/restoreOffer`,
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

async function closeOffer(id, title, worker, uid) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/closeOffer`,
            { id: id, title: title, workerID: worker, userID: uid },
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


async function updateOffer(id, offer, worker, uid) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/updateOffer`,
            { id: id, offer: offer, worker: worker, userID: uid },
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

async function takeOffer(userID, workerID, offerID, title) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/takeOffer`,
            { userID: userID, workerID: workerID, offerID: offerID, title: title },
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

async function resignFromOffer(userID, workerID, offerID, title) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/resignFromOffer`,
            { userID: userID, workerID: workerID, offerID: offerID, title: title },
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

async function acceptWorker(uid, id, workerID, title) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/acceptWorker`,
            { userID: uid, offerID: id, workerID: workerID, title: title },
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

async function rejectWorker(uid, id, workerID, title) {
    try {
        const res = await axios.post(`${baseURL}/api/offers/rejectWorker`,
            { userID: uid, offerID: id, workerID: workerID, title: title },
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
            { userID: uid, offerID: offerID },
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
            { rating: rating },
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
    insertRate,
    restoreOffer,
    setPreferences
}