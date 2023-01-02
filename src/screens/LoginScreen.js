import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../Components/Button'
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { userEmail, userAuth, userUID } from '../redux/actions/userDataAction';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../Constants/Colors';

const LoginScreen = () => {

    const dispatch = useDispatch();
    const email = useSelector((store) => store.user.email);
    const user = useSelector((store) => store.user.userAuth);
    const uid = useSelector((store) => store.user.uid);
    const lang = useSelector((store) => store.language.language);

    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    const navigation = useNavigation();
    // on component mount check if user is already logged in, if yes than go to home screen
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                handleUIDChange(user.uid);
                dispatch(userAuth(user))
                navigation.replace("Loading", { action: 'userData' })
            }
        })
        return unsubscribe;
    }, [user])

    // set user email address to redux store 
    const handleEmailChange = (value) => {
        dispatch(userEmail(value))
    }

    // set user email address to redux store 
    const handleUIDChange = (value) => {
        dispatch(userUID(value))
    }

    // function to log in user
    const handleLogIn = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                handleUIDChange(user.uid);
                dispatch(userAuth(user))
            })
            .catch(err => {
                setShowAlert(true)
            });
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="height"
            enabled>

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
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={email}
                    onChangeText={text => handleEmailChange(text)}
                    keyboardType={'email-address'}

                />
                {/* Password input */}
                <Fumi
                    label={lang.password}
                    iconClass={FontAwesomeIcon}
                    iconName={'unlock'}
                    iconColor={Colors.primary}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button text={lang.login} func={handleLogIn} outline={false}></Button>
                <Button text={lang.noAccountRegister} func={() => navigation.navigate("Register")} asText={true}></Button>
            </View>


            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={lang.oops}
                message={lang.loginError}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Ok"
                confirmButtonColor={Colors.primary}
                onConfirmPressed={() => setShowAlert(false)}
                actionContainerStyle={{ minWidth: 200 }}
            />

        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    inputContainer: {
        width: '80%',
        backgroundColor: Colors.white
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
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 40
    },
    imageLogo: {
        height: 200,
        width: 200
    }
})