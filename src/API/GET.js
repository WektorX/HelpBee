import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000'

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


export { hasUserFilledInData }