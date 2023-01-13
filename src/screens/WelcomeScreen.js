import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { polish, english } from '../redux/actions/languageAction';
import { NativeModules } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../Constants/Colors';


export default function WelcomeScreen() {


    const dispatch = useDispatch();
    const navigation = useNavigation();
    const lang = useSelector((store) => store.language.language);



    useEffect(() => {

        // Set language of app based on mobile language
        if (NativeModules.I18nManager.localeIdentifier == "pl_PL") {
            dispatch(polish());
        }
        else {
            dispatch(english());
        }

        //Navigate to login screen after 5 seconds - there will be some animation on app start then navihate to login screen

        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }]
            })
        }, 5000)
    }, [])



    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../Images/logo.jpg')}
                resizeMode="contain"
                style={styles.image}
            >
                <Text style={styles.text}>
                    {lang.appName}
                </Text>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignContent: 'center',
    },
    text: {
        color: Colors.brown,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        padding: 20,
        fontSize: 40,
        fontWeight: '600',
        marginTop: 250

    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
})

