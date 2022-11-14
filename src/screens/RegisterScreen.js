import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Button from '../components/Button'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import PhoneInput from "react-native-phone-number-input";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';

export default function RegisterScreen() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // phone number states
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedValue, setFormattedValue] = useState("");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');


    const lang = useSelector((store) => store.language.language);
    // const phoneInput = useRef(null);


    const navigation = useNavigation();

    //funtion to register user
    const handleSignUp = () => {
        // TODO: validate all inputs and if error show some text
        // let validPhoneNumber = phoneInput.current?.isValidNumber(phoneNumber);
        // alert(phoneInput.current.getCallingCode() + " " + phoneNumber + " is valid?" + validPhoneNumber)
        alert(firstName)
        //funtion to register user in firebase
        // auth
        //     .createUserWithEmailAndPassword(email, password)
        //     .then(userCredentials => {
        //         const user = userCredentials.user;
        //     })
        //     .catch(err => alert(err)); //TODO: if some errors than show error message
        //TODO: after user successfull registration insert personal info to table
    }



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='height'>
            <Image
                source={require('../images/logo_no_background.png')}
                resizeMode={'cover'}
                style={styles.imageLogo}
            />


            <View style={styles.inputContainer}>

                {/* First name input */}
                <Fumi
                    label={lang.firstName}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={firstName}
                    onChangeText={text => setFirstName(text)}
                />
                {/* Last name input */}
                <Fumi
                    label={lang.lastName}
                    iconClass={FontAwesomeIcon}
                    iconName={'child'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={lastName}
                    onChangeText={text => setLastName(text)}
                />
                {/* Phone number input */}
                <Fumi
                    label={lang.phoneNumber}
                    iconClass={FontAwesomeIcon}
                    iconName={'phone'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
                {/* <PhoneInput
                    ref={phoneInput}
                    containerStyle={styles.inputPhone}
                    defaultValue={phoneNumber}
                    defaultCode="PL"
                    layout="first"
                    onChangeText={(text) => { setPhoneNumber(text) }}
                    onChangeFormattedText={(text) => { setFormattedValue(text) }}
                /> */}
                {/* Email address input */}
                <Fumi
                    label={lang.email}
                    iconClass={FontAwesomeIcon}
                    iconName={'envelope-o'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                {/* Password input */}
                <Fumi
                    label={lang.password}
                    iconClass={FontAwesomeIcon}
                    iconName={'unlock'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                {/* Repeat password input */}
                <Fumi
                    label={lang.repeatPassword}
                    iconClass={FontAwesomeIcon}
                    iconName={'lock'}
                    iconColor={'#f95a25'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={repeatPassword}
                    onChangeText={text => setRepeatPassword(text)}
                    secureTextEntry
                />
            </View>
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
        backgroundColor: 'white'
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ffcb05'
    },
    inputPhone: {
        backgroundColor: 'white',
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 40
    },
    imageLogo: {
        height: 200,
        width: 200
    }
})