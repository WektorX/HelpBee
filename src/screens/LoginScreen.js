import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { userEmail, userAuth } from '../redux/actions/userDataAction';

const LoginScreen = () => {

    const dispatch = useDispatch();

    const email = useSelector((store) => store.user.email);
    const [password, setPassword] = useState('');

    const lang = useSelector((store) => store.language.language);

    const navigation = useNavigation();
// on component mount check if user is already logged in, if yes than go to home screen
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home");
            }
        })

        return unsubscribe;
    }, [])

// set user email address to redux store 
    const handleEmailChange = (value) =>{
        dispatch(userEmail(value))
    }

// function to log in user
    const handleLogIn = () =>{
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials =>{
                const user = userCredentials.user;
                dispatch(userAuth(user))
            })
            .catch( err => alert(err)); //TODO: catch error and show some alert and make inputs red
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
                    onChangeText={text => handleEmailChange(text)}
                    keyboardType = {'email-address'}

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
            </View>
            <View style={styles.buttonContainer}>
                <Button text={lang.login} func={handleLogIn} outline={false}></Button>
                <Button text={lang.noAccountRegister} func={() => navigation.navigate("Register")} asText={true}></Button>
            </View>


        </KeyboardAvoidingView>
    )
}

export default LoginScreen

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
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 40
    },
    imageLogo:{
        height: 200,
        width: 200
    }
})