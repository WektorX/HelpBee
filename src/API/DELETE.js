import axios from 'axios';
const baseURL = 'http://192.168.0.11:3000'
// const baseURL = 'http://192.168.0.20:3000'
// const baseURL = 'http://192.168.1.107:3000';



async function deleteOffer(id) {
    try {
        const res = await axios.delete(`${baseURL}/api/offers/deleteOffer`,
            {data: {id: id}},
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


export {deleteOffer}