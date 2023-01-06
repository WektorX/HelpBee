import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper';
import Colors, { stringToColour } from '../Constants/Colors'
import { Avatar, TextInput } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../Constants/Categories.js'
import { useNavigation } from '@react-navigation/core';
import { getUserOffers } from '../API/GET';
import { userFirstName, userLastName, userPhoneNumber, userBirthDate, userOffers } from '../redux/actions/userDataAction';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MyOffersBlock from '../Components/MyOffersBlock.js';
import Button from '../Components/Button'
import { acceptWorker, rejectWorker } from '../API/POST';

const MyOffers = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const lang = useSelector((store) => store.language.language);
  const location = useSelector((store) => store.user.location);
  const uid = useSelector((store) => store.user.uid);
  const offers = useSelector((store) => store.user.offers)
  const [status, setStatus] = useState(0);
  const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);
  const [selectedOffers, setSelectedOffers] = useState(offers.filter(item => item.status === status))

  //to refresh when come back to screen 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await retriveOffers();
    })
    return () => {
      unsubscribe();
    }
  }, [navigation])

  //refresh selected offers when sometging changes in offers
  useEffect(() => {
    setSelectedOffers(offers.filter(offer => offer.status === status));
  }, [offers])

  //function to retrive offers from server
  const retriveOffers = async () => {
    const response = await getUserOffers(uid);
    let offers = response.offers.data;
    offers = offers.map(o => {
      let tempDate = o.serviceDate.split("T")[0];
      o.serviceDate = tempDate;
      return o
    })
    dispatch(userOffers(offers))
  }

  //function to open screen to add new offer
  const newOffer = () => {
    navigation.navigate("NewOffer", { location: location });
  }

  //change tab (active, pending, cancelled, ended)
  const offerStatusChange = (event) => {
    let temp = event.nativeEvent.selectedSegmentIndex;
    setStatus(temp)
    setSelectedOffers(offers.filter(item => item.status === temp))
  }

  //click on offer view 
  const selectOffer = (id) => {
    if (selectedOffers[id].status === 0 || selectedOffers[id].status === 1) {
      navigation.navigate("EditOffer", selectedOffers[id]);
    }
    else {
      console.log("global view")
    }
  }

  //accept user request for a job
  const accept = async (offerID, workerID) => {
    const response = await acceptWorker(offerID, workerID);
    retriveOffers();
  }

  //reject user request for a job
  const reject = async (offerID, workerID) => {
    const response = await rejectWorker(offerID, workerID);
    retriveOffers();
  }

  return (
    <View style={styles.mainView}>

      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{lang.myOffersTab}</Text>
          <SegmentedControl
            values={lang.offersStatus}
            selectedIndex={status}
            onChange={(event) => offerStatusChange(event)}
            style={styles.segmentedButton}
            tintColor={Colors.purple}
            backgroundColor={Colors.purpleBackground}
            fontStyle={{ color: Colors.black }}
            activeFontStyle={{ color: Colors.white }}
          />
          <View>
            {selectedOffers.length > 0 ?

              <View style={styles.offersBlocks}>
                {
                  selectedOffers.map((offer, id) => {
                    return (<View key={id} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <MyOffersBlock
                        title={offer.title}
                        key={id}
                        id={id}
                        select={selectOffer}
                        category={offer.category}
                        date={offer.serviceDate} />
                      {offer.worker != "" && (offer.status == 1 || offer.status == 3) ?
                        <View style={styles.workerInfo}>
                          <View style={{ flexDirection: 'row', width: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar.Text
                              size={45}
                              label={offer.workerFirstName?.charAt(0) + offer.workerLastName?.charAt(0)}
                              style={{ backgroundColor: stringToColour(offer.workerFirstName + " " + offer.workerLastName) }}
                              color={Colors.white} />
                          </View>
                          <View style={{ flexDirection: 'column', width: 80, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{offer.workerFirstName + " " + offer.workerLastName}</Text>
                            <Text>{offer.workerPhone}</Text>
                          </View>

                          {offer.status == 1 ?
                            <View style={{ flexDirection: 'row', marginLeft: 30, width: 70, alignItems: 'center', justifyContent: 'center' }}>

                              <Button text={lang.reject} func={() => reject(offer.id, offer.worker)} color={Colors.red} asText={true}></Button>
                              {offer.workerStatus === "requested" ?
                                <Button text={lang.accept} func={() => accept(offer.id, offer.worker)} color={Colors.green} asText={true}></Button> : null}

                            </View>
                            :
                            <View style={{ flexDirection: 'row', marginLeft: 40, width: 60, alignItems: 'center', justifyContent: 'center' }}>
                              <Button text={lang.rate} color={Colors.purple} asText={true} func={() => console.log("rate")}></Button>
                            </View>}

                        </View>
                        : null}
                    </View>)
                  })
                }
              </View>

              :
              <Image style={styles.emptyImage} source={require('../Images/emptyOffer.png')}></Image>}
          </View>
        </View>

      </ScrollView>
      <FAB icon={'plus'} style={styles.floatingButton} color={Colors.purple} onPress={() => newOffer()} />

    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.purpleBackground
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 100,
    minWidth: 100,
  },
  floatingButton: {
    position: 'absolute',
    margin: 16,
    bottom: 70,
    right: 10,

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  emptyImage: {
    marginTop: 200,
    width: 200,
    height: 200
  },
  segmentedButton: {
    color: Colors.white,
    width: '95%',
    height: 30,
    marginTop: 20,
  },
  offersBlocks: {
    marginTop: 20,
  },
  workerInfo: {
    height: 70,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: -1,
    width: 270,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 5,
    paddingRight: 5,
  }
})

export default MyOffers