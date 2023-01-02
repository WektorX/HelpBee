import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000';
// const baseURL = 'http://192.168.0.20:3000';
// const baseURL = 'http://192.168.1.107:3000';

function hasUserFilledInData(id) {
    return new Promise(resolve => {
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
    return new Promise(resolve => {
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
    return new Promise(resolve => {
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



export { hasUserFilledInData, getUserDataByUID, getUserOffers }