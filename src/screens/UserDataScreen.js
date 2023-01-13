import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React, {useState} from 'react'
import Button from '../Components/Button'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { userFirstName, userLastName, userPhoneNumber, userBirthDate } from '../redux/actions/userDataAction';
import AwesomeAlert from 'react-native-awesome-alerts';
import { insertBasicUserData } from '../API/POST';
import Colors from '../Constants/Colors';


const UserDataScreen = (props) => {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const lang = useSelector((store) => store.language.language);
    const firstName = useSelector((store) => store.user.firstName);
    const lastName = useSelector((store) => store.user.lastName);
    const phoneNumber = useSelector((store) => store.user.phoneNumber);
    const birthDate = useSelector((store) => store.user.birthDate);
    const uid = useSelector((store) => store.user.uid);
    const email = useSelector((store) => store.user.email);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [birthDateError, setBirthDateError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const PHONE_REGEX = new RegExp(/^[0-9]{9}$/);
    const DATE_REGEX = new RegExp(/^([0-2][0-9]|(3)[0-1])(\.)(([0]?[0-9])|((1)[0-2]))(\.)\d{4}$/i);

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

    const setPersonalData = () => {

        let errorFN = firstName.length < 1;
        let errorLN = lastName.length < 1;
        let errorPN = !PHONE_REGEX.test(phoneNumber);
        let errorBD = !DATE_REGEX.test(birthDate);

        setFirstNameError(errorFN);
        setLastNameError(errorLN);
        setPhoneNumberError(errorPN);
        setBirthDateError(errorBD);

        if (errorBD || errorFN || errorLN || errorPN) {
            setShowAlert(true);
        }
        else {
            insertBasicUserData(uid, { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, birthDate: birthDate, email: email })
            if (navigation.canGoBack()) {

                navigation.goBack();

            }
            navigation.replace("Home");

        }
    }

    const goBack = () => {
        navigation.goBack();
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='height'>

            {props?.route.params.action === "edit" ? <Text style={styles.title}> {lang.editData} </Text> : null}

            {/* TODO: image picker*/}
            <View style={styles.inputContainer}>

                {/* First name input */}
                <Fumi
                    label={lang.firstName}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={firstName}
                    onChangeText={text => handleFirstNameChange(text)}
                    labelStyle={firstNameError ? styles.labelError : null}
                />
                {/* Last name input */}
                <Fumi
                    label={lang.lastName}
                    iconClass={FontAwesomeIcon}
                    iconName={'child'}
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={lastName}
                    onChangeText={text => handleLastNameChange(text)}
                    labelStyle={lastNameError ? styles.labelError : null}
                />
                {/* Phone number input */}
                <Fumi
                    label={lang.phoneNumber}
                    iconClass={FontAwesomeIcon}
                    iconName={'phone'}
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={phoneNumber}
                    onChangeText={text => handlePhoneNumberChange(text)}
                    keyboardType={'number-pad'}
                    labelStyle={phoneNumberError ? styles.labelError : null}
                />
                {/* Birth date input */}
                <Fumi
                    label={lang.birthDate}
                    iconClass={FontAwesomeIcon}
                    iconName={'calendar'}
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={birthDate}
                    onChangeText={text => handleBirthDateChange(text)}
                    keyboardType={'number-pad'}
                    labelStyle={birthDateError ? styles.labelError : null}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button text={lang.save} func={setPersonalData} outline={false}></Button>

                {props?.route.params.action === "edit" ?
                    <Button text={lang.cancel} func={goBack} asText={true}></Button> :
                    null}

            </View>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={lang.userDataError}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Ok"
                confirmButtonColor="#ffcb05"
                onConfirmPressed={() => setShowAlert(false)}
            />
        </KeyboardAvoidingView>
    )
}

export default UserDataScreen;

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
        marginTop: 40
    },
    imageLogo: {
        height: 200,
        width: 200
    },
    labelError: {
        color: Colors.red
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
    },
})