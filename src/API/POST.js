import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000'

async function insertBasicUserData(id, user) {
    try {
        const res = await axios.post(`${baseURL}/api/users/fillInUserData`,
            {
                uid: id,
                birthDate: user.birthDate,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber
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


export { insertBasicUserData }