import { StyleSheet, Text, View, ScrollView, BackHandler, KeyboardAvoidingView, Image, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors, { stringToColour } from '../Constants/Colors'
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail, userFirstName, userLastName, userPhoneNumber, userBirthDate, userLocation } from '../redux/actions/userDataAction';
import { polish, english } from '../redux/actions/languageAction';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, TextInput } from 'react-native-paper'
import Button from '../Components/Button';
import AwesomeAlert from 'react-native-awesome-alerts';
import Categories from '../Constants/Categories.js'
import DatePicker from 'react-native-modern-datepicker';
import CategorySelect from '../Components/CategorySelect';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { insertOffer } from '../API/POST';


// TODO: add required (title, description and category)
const NewOfferScreen = (props) => {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const lang = useSelector((store) => store.language.language);
    const location = useSelector((store) => store.user.location);
    const uid = useSelector((store) => store.user.uid);
    //local states
    const [showAlert, setShowAlert] = useState(false);
    //new offer states
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [category, setCategory] = useState('');
    const [currentDate] = useState(new Date());
    const [reward, setReward] = useState(0);
    const [region, setRegion] = useState({
        latitude: location.Latitude,
        longitude: location.Longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
    });
    const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);

    useEffect(() => {
        setCategories(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN)
    }, [lang])

    useEffect(() => {
        const backAction = () => {
            setShowAlert(true)
            return true;
        };

        //listener for Back system button press
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);


    const goBack = () => {
        // clear state of all inputs
        setTitle('');
        setDesc('');
        setCategory('');
        setShowAlert(false);
        navigation.goBack();
    }

    const saveOffer = async() => {
        //send offer object to server

        const offer = {
            title: title,
            description : desc,
            location : region,
            uid: uid,
            serviceDate: date,
            category: category,
            reward: parseFloat(reward)
        }
        const response = await insertOffer(offer);
        if(response.status === 200){
            goBack();
        }
    }



    return (
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', }} behavior="height" enabled >
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>{lang.newOffer}</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.title}</Text>
                            <TextInput
                                onChangeText={(vale) => setTitle(vale)}
                                style={styles.input}
                                maxLength={30}
                                value={title}>

                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.category}</Text>
                            <View style={styles.categoriesContainer}>
                                {
                                    categories.map((item, id) => {
                                        return (
                                            <CategorySelect key={id} selected={item.id === category} name={item.name} id={item.id} select={setCategory} />
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.description}</Text>
                            <TextInput
                                onChangeText={(vale) => setDesc(vale)}
                                style={styles.input}
                                maxLength={300}
                                multiline={true}
                                numberOfLines={5}
                                value={desc}>

                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.reward}</Text>
                            <TextInput
                                onChangeText={(vale) => setReward(vale)}
                                style={styles.input}
                                maxLength={8}
                                value={reward}
                                keyboardType={'decimal-pad'}>

                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.offerDate}</Text>
                            <DatePicker
                                onSelectedChange={date => setDate(date.replace(/\//g, "-"))}
                                minimumDate={currentDate.toISOString().slice(0, 10)}
                                mode={'calendar'}
                                currentDate={date}
                                selected={date}
                            />
                        </View>

                    </View>

                    <View style={[styles.mapContainer, styles.inputView]}>

                        <MapView
                            style={styles.map}
                            initialRegion={region}
                            onRegionChangeComplete={(region) => setRegion(region)}
                        />
                        <View style={styles.markerFixed}>
                            <Image style={styles.marker} source={require('../Images/icons8-marker.png')} />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button text={lang.save} func={saveOffer} color={Colors.purple}></Button>
                        <Button text={lang.cancel} func={goBack} asText={true} color={Colors.purple}></Button>
                    </View>
                </View>
            </ScrollView>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={lang.discardChanges}
                message={lang.discardChangesDesc}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText={lang.yes}
                confirmButtonColor={Colors.pink}
                onConfirmPressed={() => goBack()}
                showCancelButton={true}
                cancelText={lang.no}
                cancelButtonColor={Colors.purple}
                onCancelPressed={() => setShowAlert(false)}
                actionContainerStyle={{ minWidth: 200 }}
            />
        </KeyboardAvoidingView>



    )
}

export default NewOfferScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingTop: 100
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.purple,
    },
    inputContainer: {
        width: '80%',
    },
    mapContainer:{
        width: '100%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputView: {
        marginTop: 10,
    },
    input: {
        backgroundColor: Colors.purpleBackground,
    },
    inputTitle: {
        fontWeight: 'bold',
        color: Colors.purple
    },
    categoriesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    map: {
        height: 300,
        // width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    }
})