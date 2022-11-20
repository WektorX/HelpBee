import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Button from '../components/Button'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { userEmail, userAuth, userFirstName, userLastName, userPhoneNumber } from '../redux/actions/userDataAction';

export default function UserDataScreen() {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const userAuthObj = useSelector((store) => store.user.userAuth);
    const lang = useSelector((store) => store.language.language);
    const email = useSelector((store) => store.user.email);
    const firstName = useSelector((store) => store.user.firstName);
    const lastName = useSelector((store) => store.user.lastName);
    const phoneNumber = useSelector((store) => store.user.phoneNumber);


    //set email address
    const handleEmailChange = (value) => {
        dispatch(userEmail(value))
    }
    //set first name address
    const handleFirstNameChange = (value) => {
        dispatch(userFirstName(value))
    }
    //set last name address
    const handleLastNameChange = (value) => {
        dispatch(userLastName(value))
    }
    //set phone number address
    const handlePhoneNumberChange = (value) => {
        dispatch(userPhoneNumber(value))
    }


    const setPersonalData = () => {
        // TODO: validate all inputs and if error show some text
        // let validPhoneNumber = phoneInput.current?.isValidNumber(phoneNumber);
        // alert(phoneInput.current.getCallingCode() + " " + phoneNumber + " is valid?" + validPhoneNumber)
        alert(firstName)
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='height'>
            {/* TODO: image picker*/}

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
                    onChangeText={text => handleFirstNameChange(text)}
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
                    onChangeText={text => handleLastNameChange(text)}
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
                    onChangeText={text => handlePhoneNumberChange(text)}
                    keyboardType = {'number-pad'}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button text={lang.save} func={setPersonalData} outline={false}></Button>
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