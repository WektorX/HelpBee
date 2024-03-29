import { StyleSheet, Text, View, ScrollView, BackHandler, KeyboardAvoidingView, Image, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../Constants/Colors'
import { useNavigation } from '@react-navigation/core';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput } from 'react-native-paper'
import Button from '../Components/Button';
import AwesomeAlert from 'react-native-awesome-alerts';
import Categories from '../Constants/Categories.js'
import DatePicker from 'react-native-modern-datepicker';
import CategorySelect from '../Components/CategorySelect';
import MapView from 'react-native-maps';
import { deleteOffer } from '../API/DELETE';
import { withdrawOffer, updateOffer, restoreOffer } from '../API/POST';
import SegmentedControl from '@react-native-segmented-control/segmented-control';


// TODO: add required (title, description and category)
const EditOfferScreen = (props) => {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const userAuthObj = useSelector((store) => store.user.userAuth);
    const lang = useSelector((store) => store.language.language);
    const location = useSelector((store) => store.user.location);
    const uid = useSelector((store) => store.user.uid);
    //local states
    const [showAlert, setShowAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    //new offer states
    const [title, setTitle] = useState(props.route.params.title);
    const [desc, setDesc] = useState(props.route.params.description);
    const [date, setDate] = useState(props.route.params.serviceDate);
    const [category, setCategory] = useState(props.route.params.category);
    const [reward, setReward] = useState(props.route.params.reward);
    const [worker, setWorker] = useState(props.route.params.worker);
    const [currentDate] = useState(new Date().toISOString().slice(0, 10));
    const [status, setStatus] = useState(props.route.params.status);
    const [type, setType] = useState(props.route.params.type);
    const [inReturn, setInReturn] = useState(props.route.params.inReturn);
    const [region, setRegion] = useState({
        latitude: props.route.params.location._latitude,
        longitude: props.route.params.location._longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
    });
    const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);

    useEffect(() => {
        setCategories(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);
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

    const saveOffer = async () => {
        //send offer object to server
        const offer = {
            title: title,
            description: desc,
            location: region,
            uid: uid,
            serviceDate: date,
            category: category,
            status: status,
            reward: (type === 'monetary' ? parseFloat(reward? reward: 0) : 0),
            type: type,
            inReturn: (type === 'monetary' ? '' : inReturn)
        }
        const response = await updateOffer(props.route.params.id, offer, worker, uid);
        // TODO: handle error
        goBack();
    }

    const delOffer = async () => {
        const response = await deleteOffer(props.route.params.id, title, worker, uid)
        // TODO: handle error
        goBack();
    }

    const withdraw = async () => {
        const response = await withdrawOffer(props.route.params.id, title, worker, uid)
        // TODO: handle error
        goBack();
    }

    const restore = async () => {
        const response = await restoreOffer(props.route.params.id)
        // TODO: handle error
        goBack();
    }


    const selectDate = (date) => {
        if (status !== 2) {
            setDate(date.replace(/\//g, "-"))
        }
    }

    //change type of offer
    const offerTypeChange = (event) => {
        let temp = event.nativeEvent.selectedSegmentIndex;
        setType(temp === 0 ? 'monetary' : 'exchange');
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', }} behavior="height" enabled >
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>{lang.editOffer}</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.title}</Text>
                            <TextInput
                                onChangeText={(vale) => setTitle(vale)}
                                style={styles.input}
                                maxLength={30}
                                value={title}
                                disabled={status === 2}>
                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.category}</Text>
                            <View style={styles.categoriesContainer}>
                                {
                                    categories.map((item, id) => {
                                        return (
                                            <CategorySelect
                                                key={id}
                                                selected={item.id === category}
                                                name={item.name}
                                                id={item.id}
                                                select={setCategory}
                                                disabled={status === 2} />
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
                                value={desc}
                                disabled={status === 2}>
                            </TextInput>
                        </View>
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.offerType}</Text>
                            <SegmentedControl
                                values={lang.offersType}
                                selectedIndex={type === 'monetary' ? 0 : 1}
                                onChange={(event) => offerTypeChange(event)}
                                style={styles.segmentedButton}
                                tintColor={Colors.purple}
                                backgroundColor={Colors.purpleBackground}
                                fontStyle={{ color: Colors.black }}
                                activeFontStyle={{ color: Colors.white }}
                            />
                        </View>
                        {type === 'monetary' ?
                            <View style={styles.inputView}>
                                <Text style={styles.inputTitle}>{lang.reward}</Text>
                                <TextInput
                                    onChangeText={(vale) => setReward(vale)}
                                    style={styles.input}
                                    maxLength={8}
                                    value={reward.toString()}
                                    keyboardType={'decimal-pad'}
                                    disabled={status === 2}>
                                </TextInput>
                            </View>
                            :
                            <View style={styles.inputView}>
                                <Text style={styles.inputTitle}>{lang.inReturn}</Text>
                                <TextInput
                                    onChangeText={(vale) => setInReturn(vale)}
                                    style={styles.input}
                                    maxLength={300}
                                    multiline={true}
                                    numberOfLines={3}
                                    value={inReturn}
                                    disabled={status === 2}>
                                </TextInput>
                            </View>
                        }
                        <View style={styles.inputView}>
                            <Text style={styles.inputTitle}>{lang.offerDate}</Text>
                            <DatePicker
                                onSelectedChange={date => selectDate(date)}
                                minimumDate={currentDate}
                                mode={'calendar'}
                                current={date}
                                selected={date}

                                disableDateChange={status === 2}
                            />

                        </View>

                    </View>

                    <View style={[styles.mapContainer, styles.inputView]}>

                        <MapView
                            style={styles.map}
                            initialRegion={region}
                            pitchEnabled={status !== 2}
                            zoomEnabled={status !== 2}
                            rotateEnabled={status !== 2}
                            scrollEnabled={status !== 2}
                            onRegionChangeComplete={(region) => setRegion(region)}
                        />
                        <View style={styles.markerFixed}>
                            <Image style={styles.marker} source={require('../Images/icons8-marker.png')} />
                        </View>
                    </View>
                    {status !== 2 ?
                        <View style={styles.buttonContainer}>
                            <Button text={lang.save} func={saveOffer} color={Colors.purple}></Button>
                            <Button text={lang.withdraw} func={withdraw} color={Colors.pink}></Button>
                            <Button text={lang.delete} func={() => setShowDeleteAlert(true)} asText={true} color={Colors.red}></Button>
                        </View>
                        :
                        <View style={styles.buttonContainer}>
                            <Button text={lang.restore} func={restore} color={Colors.pink}></Button>
                            <Button text={lang.delete} func={() => setShowDeleteAlert(true)} asText={true} color={Colors.red}></Button>
                        </View>
                    }
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

            <AwesomeAlert
                show={showDeleteAlert}
                showProgress={false}
                title={lang.delete}
                message={lang.deleteMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText={lang.yes}
                confirmButtonColor={Colors.red}
                onConfirmPressed={() => delOffer()}
                showCancelButton={true}
                cancelText={lang.no}
                cancelButtonColor={Colors.purple}
                onCancelPressed={() => setShowDeleteAlert(false)}
                actionContainerStyle={{ minWidth: 200 }}
            />
        </KeyboardAvoidingView>



    )
}

export default EditOfferScreen

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
    mapContainer: {
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
    },
    segmentedButton: {
        color: Colors.white,
        width: '95%',
        height: 30,
        marginTop: 20,
    },
})