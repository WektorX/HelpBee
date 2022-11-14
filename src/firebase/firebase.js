import * as firebase from "firebase"
import {firebaseConfig} from "./firebaseConfig"

let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else{
    app = firebase.app();
}

const auth = firebase.auth();


export {auth};