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
import { hasUserFilledInData } from '../API/GET';
import { useNavigation, useLocation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { userEmail, userAuth, userUID } from '../redux/actions/userDataAction';
import Colors from '../Constants/Colors';

const LoadingScreen = (props) => {

    const dispatch = useDispatch();
    const user = useSelector((store) => store.user.userAuth);
    const uid = useSelector((store) => store.user.uid);
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
                        navigation.navigate("Home");
                    }
                    else {
                        navigation.navigate("UserData");
                    }
                }, 500)
            })
            .catch((e) => {
                console.log(e);
                navigation.navigate("Login");
            })
    }

    return (
        <View style={styles.container}>

            <BarIndicator
                color={Colors.red}
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