import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';
import { hasUserFilledInData, getUserDataByUID } from '../API/GET';
import { useNavigation, useLocation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { userEmail, userAuth, userUID, userBirthDate, userFirstName, userLastName, userPhoneNumber } from '../redux/actions/userDataAction';
import Colors from '../Constants/Colors';

const LoadingScreen = (props) => {

    const dispatch = useDispatch();
    const user = useSelector((store) => store.user.userAuth);
    const uid = useSelector((store) => store.user.uid);
    const firstName = useSelector((store) => store.user.firstName);
    const lastName = useSelector((store) => store.user.lastName);
    const phoneNumber = useSelector((store) => store.user.phoneNumber);
    const birthDate = useSelector((store) => store.user.birthDate);
    const email = useSelector((store) => store.user.email);

    const navigation = useNavigation();
    // TODO: if user filledIN data than get them and save to store
    useEffect(() => {
        if (props.route.params.action === 'userData') {
            checkUserData();
        }
    }, [])

    const checkUserData = async () => {
        await hasUserFilledInData(user.uid)
            .then((res) => {
                setTimeout(() => {
                    if (res.filledIn) {
                        getUserData();
                    }
                    else {
                        navigation.replace("UserData");
                    }
                }, 1000)
            })
            .catch((e) => {
                console.log(e);
                navigation.replace("Login");
            })
    }

    const getUserData = async () => {
        await getUserDataByUID(user.uid)
            .then((res) => {
                let userData = res.user.data;
                handleBirthDateChange(new Date(userData.birthDate).toDateString());
                handleLastNameChange(userData.lastName);
                handleFirstNameChange(userData.firstName);
                handlePhoneNumberChange(userData.phoneNumber);
                handleEmailChange(user.email)
            })
            .then(() => {
                navigation.navigate("Home");
            })
            .catch((e) => {
                console.log("Error", e)
            })

    }

    //set first name 
    const handleFirstNameChange = (value) => {
        dispatch(userFirstName(value))
    }
    //set last name 
    const handleLastNameChange = (value) => {
        dispatch(userLastName(value))
    }
    //set phone number 
    const handlePhoneNumberChange = (value) => {
        dispatch(userPhoneNumber(value))
    }
    //set birth date
    const handleBirthDateChange = (value) => {
        dispatch(userBirthDate(value))
    }
    // set user email address to redux store 
    const handleEmailChange = (value) => {
        dispatch(userEmail(value))
    }


    return (
        <View style={styles.container}>

            <BarIndicator
                color={Colors.purple}
                size={80}
                count={9} />

        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})