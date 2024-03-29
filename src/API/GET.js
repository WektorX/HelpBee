import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000';
// const baseURL = 'http://192.168.0.20:3000';
// const baseURL = 'http://192.168.1.107:3000';

function checkIfUserBlocked(uid) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/users/checkIfBlocked`, {
            params: {
                uid: uid
            }
        })
            .then(res => {
                resolve({ status: res.status, blocked: res.data.blocked })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, filledIn: false });
            })
    })

}

function hasUserFilledInData(id) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/users/checkIfUserFilledBasicData`, {
            params: {
                uid: id
            }
        })
            .then(res => {
                resolve({ status: res.status, filledIn: ((res.data.filledIn) ? res.data.filledIn : false) })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, filledIn: false });
            })
    })

}

function getUserDataByUID(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURL}/api/users/getUserDataByUID`, {
            params: {
                uid: id
            }
        })
            .then(res => {
                resolve({ status: res.status, user: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


async function getUserOffers(id) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/offers/getUserOffers`, {
            params: {
                uid: id
            }
        })
            .then(res => {
                resolve({ status: res.status, offers: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


async function getUserJobs(id) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/offers/getUserJobs`, {
            params: {
                uid: id
            }
        })
            .then(res => {
                resolve(res.data)
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}



async function getOffersByCategory(category, distance, location, uid) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/offers/getOffersByCategory`, {
            params: {
                category: category,
                distance: distance,
                location: location,
                uid: uid
            }
        })
            .then(res => {
                resolve({ status: res.status, offers: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}

async function getUserContactInfo(id) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/users/getUserContactInfo`, {
            params: {
                uid: id
            }
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


async function getUserRating(uid) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/ratings/getUserRating`, {
            params: {
                uid: uid
            }
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


async function getNewOffers(uid, distance, location, categories) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/offers/getNewOffers`, {
            params: {
                uid: uid,
                distance: distance,
                location: location,
                categories: categories
            }
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


async function getMessages(employerID, workerID, offerID) {
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/chat/getMessages`, {
            params: {
                employerID: employerID,
                workerID: workerID,
                offerID: offerID,
            }
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}

export {
    hasUserFilledInData,
    getUserDataByUID,
    getUserOffers,
    getOffersByCategory,
    getUserContactInfo,
    getUserJobs,
    getUserRating,
    getNewOffers,
    checkIfUserBlocked,
    getMessages
}