import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Button from '../Components/Button'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../Constants/Colors';

const ChangePasswordScreen = () => {
    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const lang = useSelector((store) => store.language.language);
    //local states
    const [validPasswords, setValidPasswords] = useState(true);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [alertTitle, setAlertTitle] = useState('');
    const [alertMsg, setAlertMsg] = useState('');


    const goBack = () => {
        setPassword(""),
            setRepeatPassword("");
        setValidPasswords(true);
        navigation.goBack();
    }
    const changePassword = () => {

        if (password === repeatPassword) {
            var user = auth.currentUser;
            user.updatePassword(password)
                .then(() => {
                    setAlertMsg(lang.passwordChangeSuccess);
                    setAlertTitle(lang.success);
                })
                .catch((error) => {
                    setAlertMsg(lang.passwordChangeError);
                    setAlertTitle(lang.oops);
                })
                .finally(() => {
                    setShowAlert(true);
                })

        }
        else {
            setValidPasswords(false);
        }

    }

    const closeError = () => {
        setShowAlert(false);
        goBack();
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.title}>{lang.changePassword}</Text>
            <View style={styles.inputContainer}>
                {/* Password input */}
                <Fumi
                    label={lang.password}
                    iconClass={FontAwesomeIcon}
                    iconName={'unlock'}
                    iconColor={(validPasswords ? Colors.green : Colors.red)}
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
                    iconColor={(validPasswords ? Colors.green : Colors.red)}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={repeatPassword}
                    onChangeText={text => setRepeatPassword(text)}
                    secureTextEntry
                    inputStyle={(validPasswords ? null : styles.inputError)}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button text={lang.save} func={changePassword} color={Colors.green}></Button>
                <Button text={lang.cancel} func={goBack} asText={true} color={Colors.green}></Button>
            </View>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMsg}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Ok"
                confirmButtonColor={Colors.green}
                onConfirmPressed={() => closeError()}
                actionContainerStyle={{ minWidth: 200 }}
            />

        </KeyboardAvoidingView>
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingTop: 100
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.green,
    },
    inputContainer: {
        width: '80%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignContent: 'center',
    },
})