import { StyleSheet, Text, View, KeyboardAvoidingView, Image } from 'react-native'
import React, { useEffect, useState} from 'react'
import Button from '../Components/Button'
import { auth } from '../firebase/firebase.js';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { userEmail, userAuth } from '../redux/actions/userDataAction';
import Colors from '../Constants/Colors';

export default function RegisterScreen() {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const userAuthObj = useSelector((store) => store.user.userAuth);
    const email = useSelector((store) => store.user.email);
    const lang = useSelector((store) => store.language.language);
    //local states
    const [validEmail, setValidEmail] = useState(true);
    const [validPasswords, setValidPasswords] = useState(true);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    //set email address
    const handleEmailChange = (value) => {
        dispatch(userEmail(value))
    }

    // When authentication complete go to UserDataScreen
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("UserData", {action : "register"});
            }
        })
        return unsubscribe;
    }, [])

    //function to validate email address
    const validateEmail = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return reg.test(email);
    }


    //funtion to register user
    const handleSignUp = () => {
        //validate email address
        //when email is valid
        if (validateEmail()) {
            setValidEmail(true)
            setErrorMsg('');
            //check if passwords are the same
            if (password === repeatPassword) {
                //funtion to register user in firebase
                setValidPasswords(true);
                setErrorMsg('');
                auth
                    .createUserWithEmailAndPassword(email, password)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                        dispatch(userAuth(user))
                    })
                    .catch(err => alert(err)); //TODO: if some errors than show error message
            }
            //if passwords are different
            else {
                setValidPasswords(false);
                setErrorMsg(lang.differentPasswords);
            }
        }
        //when email address is not valid
        else {
            setValidEmail(false)
            setErrorMsg(lang.invalidEmail);
        }
    }



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='height'>
            <Image
                source={require('../Images/logo_no_background.png')}
                resizeMode={'cover'}
                style={styles.imageLogo}
            />
            <View style={styles.inputContainer}>
                {/* Email address input */}
                <Fumi
                    label={lang.email}
                    iconClass={FontAwesomeIcon}
                    iconName={'envelope-o'}
                    iconColor={(validEmail ? Colors.primary : Colors.red)}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={email}
                    onChangeText={text => handleEmailChange(text)}
                    inputStyle={(validEmail ? null : styles.inputError)}
                    keyboardType = {'email-address'}
                />
                {/* Password input */}
                <Fumi
                    label={lang.password}
                    iconClass={FontAwesomeIcon}
                    iconName={'unlock'}
                    iconColor={(validPasswords ? Colors.primary : Colors.red)}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    inputStyle={(validPasswords ? null : styles.inputError)}
                />
                {/* Repeat password input */}
                <Fumi
                    label={lang.repeatPassword}
                    iconClass={FontAwesomeIcon}
                    iconName={'lock'}
                    iconColor={(validPasswords ? Colors.primary : Colors.red)}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={repeatPassword}
                    onChangeText={text => setRepeatPassword(text)}
                    secureTextEntry
                    inputStyle={(validPasswords ? null : styles.inputError)}
                />
            </View>
            {errorMsg.length > 0 ? <Text style = {styles.errorMsg}>{errorMsg}</Text>: null}
            <View style={styles.buttonContainer}>
                <Button text={lang.register} func={handleSignUp} outline={false}></Button>
                <Button text={lang.alreadyHaveAccount} func={() => navigation.navigate("Login")} asText={true}></Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.primary
    },
    inputPhone: {
        backgroundColor: Colors.white,
        marginTop: 5,
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    imageLogo: {
        height: 200,
        width: 200
    },

    inputError: {
        color: Colors.red
    },

    errorMsg:{
        color: Colors.red,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    }
})