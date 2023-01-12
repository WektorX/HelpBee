import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { BarIndicator } from 'react-native-indicators';
import { hasUserFilledInData, getUserDataByUID } from '../API/GET';
import { useNavigation, useLocation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { userEmail, userAuth, userUID, userBirthDate, userFirstName, userLastName, userPhoneNumber, userDistance, userPreferences } from '../redux/actions/userDataAction';
import Colors from '../Constants/Colors';

const LoadingScreen = (props) => {

    const dispatch = useDispatch();
    const user = useSelector((store) => store.user.userAuth);

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
                        navigation.replace("UserData", { action: "insert" });
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
                handleEmailChange(userData.email)
                handleDistanceChange(userData.distance);
                handlePreferencesChange(userData.preferences)
            })
            .then(() => {
                navigation.replace("Home");
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
    // set user distance to redux store 
    const handleDistanceChange = (value) => {
        dispatch(userDistance(value))
    }
    // set user preferences to redux store 
    const handlePreferencesChange = (value) => {
        dispatch(userPreferences(value))
    }


    return (
        <View style={styles.container}>

            <BarIndicator
                color={Colors.primary}
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