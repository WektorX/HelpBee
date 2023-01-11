import { StyleSheet, Text, View, ScrollView, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors, { stringToColour } from '../Constants/Colors'
import { useNavigation } from '@react-navigation/core';
import { userDistance } from '../redux/actions/userDataAction';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from 'react-native-paper'
import { Slider } from '@miblanchard/react-native-slider';
import Categories from '../Constants/Categories.js'
import MapView, { Marker } from 'react-native-maps';
import { getOffersByCategory } from '../API/GET'
import MyOffersBlock from '../Components/MyOffersBlock';
import { getUserContactInfo } from '../API/GET'
import Button from '../Components/Button'
import { reportOffer, resignFromOffer, takeOffer } from '../API/POST';
import { WaveIndicator } from 'react-native-indicators';
import call from 'react-native-phone-call'

const CategoryOffersScreen = (props) => {
    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const lang = useSelector((store) => store.language.language);
    const location = useSelector((store) => store.user.location);
    const uid = useSelector((store) => store.user.uid);
    const distance = useSelector((store) => store.user.distance);


    //local states 
    const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);

    const [category, setCategory] = useState(categories.find(item => item.id === props.route.params.category));
    const [offers, setOffers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        refreshOffers();
    }, [category])


    const distanceChange = async () => {
        refreshOffers();
    }

    const refreshOffers = async () => {
        const response = await getOffersByCategory(category.id, distance, location, uid);
        let offers = response.offers.offers;
        offers = offers.map(o => {
            let tempDate = o.serviceDate.split("T")[0];
            o.serviceDate = tempDate;
            o.distance = getDistanceFromLatLonInKm(location.Latitude, location.Longitude, o.location._latitude, o.location._longitude)
            return o
        })
        setOffers(offers);
        setLoading(false);
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    const selectedOffer = async (id) => {
        const response = await getUserContactInfo(offers[id].userID);
        let temp = offers[id];
        temp.firstName = response.data.firstName;
        temp.lastName = response.data.lastName;
        temp.phoneNumber = response.data.phoneNumber;
        setSelected(temp);
        setShowModal(true)
    }

    const takeJob = async () => {
        const response = await takeOffer(uid, selected.id)
        if (response.status === 200) {
            let temp = offers;
            let index = temp.findIndex(item => item.id === selected.id);
            temp[index].worker = uid;
            setOffers(temp);
        }
        setShowModal(false)
    }

    const resign = async () => {
        const response = await resignFromOffer(uid, selected.id);
        if (response.status === 200) {
            let temp = offers;
            let index = temp.findIndex(item => item.id === selected.id);
            temp[index].worker = "";
            temp[index].workersHistory.push(uid);
            setOffers(temp);
        }
        setShowModal(false);
    }

    const report = async () => {
        const response = await reportOffer(uid, selected.id);
        if (response.status === 200) {
            let temp = offers;
            let index = temp.findIndex(item => item.id === selected.id);
            temp[index].reportedBy.push(uid);
            setOffers(temp);
        }
        setShowModal(false);
    }


    const phoneCall = () => {
        let args = {
            number: selected.phoneNumber,
            prompt: false,
            skipCanOpen: true
        }
        call(args).catch(console.error)
    }
    return (
        <View style={styles.mainView}>

            <Modal
                animationType={'slide'}
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.centeredView}
                    onPressOut={() => setShowModal(false)}
                >
                    {selected ?

                        <View style={styles.modalView}>

                            {selected.userID != uid && selected.reportedBy.indexOf(uid) < 0 ?
                                <TouchableOpacity
                                    onPress={() => report()}
                                    style={{ width: 50, height: 30, position: 'absolute', top: 5, left: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../Images/report.png')} style={{ width: 15, height: 15 }} />
                                    <Text style={{ marginLeft: 5 }}>Zgłoś</Text>
                                </TouchableOpacity> : null}

                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={{ width: 30, height: 30, position: 'absolute', top: 5, right: 0 }}>
                                <Image source={require('../Images/close.png')} style={{ width: 25, height: 25 }} />
                            </TouchableOpacity>


                            <ScrollView style={{ flex: 1 }}>
                                <View style={styles.alignView}>

                                    <Text style={styles.modalTitle}>{selected.title}</Text>
                                    <Text style={[styles.modalText, styles.modalReward]}>
                                        {lang.reward} {selected.reward.toFixed(2)} PLN
                                    </Text>

                                    <Text style={styles.modalText}>{selected.serviceDate}</Text>
                                    <MapView
                                        initialRegion={{
                                            latitude: selected.location._latitude,
                                            longitude: selected.location._longitude,
                                            latitudeDelta: 0.04,
                                            longitudeDelta: 0.04,
                                        }}
                                        style={styles.map}
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: selected.location._latitude,
                                                longitude: selected.location._longitude
                                            }}
                                        />
                                    </MapView>
                                    <Text style={[styles.modalText, styles.modalDescription]}>
                                        {selected.description}
                                    </Text>
                                    <View style={styles.userInfo}>
                                        <Avatar.Text
                                            size={80}
                                            label={selected.firstName?.charAt(0) + selected.lastName?.charAt(0)}
                                            style={[styles.userAvatar, { backgroundColor: stringToColour(selected.firstName + " " + selected.lastName) }]}
                                            color={Colors.white} />
                                        <View>
                                            <Text style={[styles.modalText, styles.userName]}>{selected.firstName + " " + selected.lastName}</Text>
                                            <Text style={styles.modalText}>{selected.phoneNumber}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        {selected.userID !== uid && selected.worker !== uid ? <Button text={lang.takeJob} func={takeJob} color={Colors.primary}></Button> : null}
                                        {selected.worker === uid ? <Button text={lang.resign} func={resign} color={Colors.red} ></Button> : null}
                                        <Button text={lang.call} func={phoneCall} color={Colors.green}></Button>
                                        <Button text={lang.close} func={() => setShowModal(false)} color={Colors.red} asText={true}></Button>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        : null}
                </View>
            </Modal>



            <ScrollView>

                <View style={styles.container}>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                    <View style={styles.filters}>
                        <Text style={styles.distanceText}>
                            {distance} KM
                        </Text>
                        <Slider
                            value={distance}
                            onValueChange={(value) => dispatch(userDistance(value))}
                            onSlidingComplete={distanceChange}
                            animateTransitions={true}
                            animationType={'spring'}
                            maximumValue={100}
                            minimumValue={1}
                            step={5}
                            thumbTintColor={Colors.primary}
                            trackStyle={{ backgroundColor: Colors.primaryAlpha }}
                            minimumTrackTintColor={Colors.primaryAlpha}
                        />
                    </View>
                    {loading ?

                        <WaveIndicator
                            style={{ marginTop: 200 }}
                            color={Colors.primary}
                            size={100}
                            count={5} />
                        :
                        <View style={styles.offersContainer}>
                            {
                                offers.length > 0 ?
                                    (
                                        offers.map((item, id) => {
                                            return (
                                                <MyOffersBlock
                                                    key={id}
                                                    select={selectedOffer}
                                                    id={id}
                                                    category={category.id}
                                                    date={item.serviceDate}
                                                    distance={item.distance}
                                                    title={item.title}
                                                    color={Colors.primary}
                                                />
                                            )
                                        })
                                    )
                                    :
                                    <View style={styles.noOffers}>
                                        <Image source={require('../Images/emptyOffer.png')} style={styles.noImage} />
                                        <Text style={styles.noText}>{lang.noActiveOffers}</Text>
                                    </View>
                            }
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default CategoryOffersScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.primaryBackground
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 100,
        minWidth: 100,
    },
    categoryTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    filters: {
        flex: 1,
        marginTop: 30,
        minWidth: 200,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    noOffers: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    noImage: {
        marginTop: 50,
        width: 150,
        height: 150
    },
    noText: {
        marginTop: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    alignView: {
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 35,
        paddingRight: 0,
        paddingLeft: 0,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 550,
        maxHeight: 650
    },
    buttonContainer: {
        width: '60%',
    },
    textStyle: {
        color: Colors.white,
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 5,
        marginTop: 5,
        textAlign: "center"
    },
    modalTitle: {
        marginBottom: 10,
        fontSize: 30,
        textAlign: "center",
        fontWeight: 'bold',
        color: Colors.primary
    },
    map: {
        width: 320,
        height: 200
    },
    modalDescription: {
        padding: 15,
        textAlign: 'justify'
    },
    modalReward: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        marginRight: 30
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 20,
    }
})