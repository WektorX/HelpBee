import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB, TextInput } from 'react-native-paper';
import Colors, { stringToColour } from '../Constants/Colors'
import { Avatar } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../Constants/Categories.js'
import { useNavigation } from '@react-navigation/core';
import { getUserOffers, getUserRating } from '../API/GET';
import { userOffers } from '../redux/actions/userDataAction';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MyOffersBlock from '../Components/MyOffersBlock.js';
import Button from '../Components/Button'
import { acceptWorker, rejectWorker, withdrawOffer, closeOffer, insertRate } from '../API/POST';
import { Rating } from 'react-native-ratings';

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
  const [refreshing, setRefreshing] = useState(false);
  const [offerToRate, setOfferToRate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({})
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
    retriveOffers();
    setSelectedOffers(offers.filter(item => item.status === temp))
  }

  //click on offer view 
  const selectOffer = (id) => {
    if (selectedOffers[id].status === 0 || selectedOffers[id].status === 1) {
      navigation.navigate("EditOffer", selectedOffers[id]);
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

  const close = async (offerID) => {
    const response = await closeOffer(offerID);
    retriveOffers();
  }

  const cancel = async (offerID) => {
    const response = await withdrawOffer(offerID);
    retriveOffers();
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await retriveOffers();
    setSelectedOffers(offers.filter(item => item.status === status))
    setRefreshing(false)
  }

  const startRating = (id) => {
    setShowModal(true);
    console.log(selectedOffers[id])
    setOfferToRate(selectedOffers[id]);
  }

  const rate = async () => {
    let ratings = {
      category: offerToRate.category,
      comment: comment,
      employerID: offerToRate.userID,
      offerID: offerToRate.id,
      rating: rating,
      workerID: offerToRate.worker
    }
    const response = await insertRate(ratings);
    if (response.status == 200) {
      let index = selectedOffers.findIndex(item => item.id === offerToRate.id);
      let temp = selectedOffers;
      temp[index].rating = rating;
      setSelectedOffers(temp);
    }

    setShowModal(false)

  }


  const showUser = async (uid) => {
    console.log(uid);
    const response = await getUserRating(uid);
    console.log(response.data.comments)
    setUserInfo(response.data)
    setShowUserInfo(true);
  }

  return (
    <View style={styles.mainView}>
      {/* MODAL FOR RATING USER */}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.centeredView}>
          {offerToRate ?

            <View style={styles.modalView}>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{ width: 30, height: 30, position: 'absolute', top: 5, right: 0 }}>
                <Image source={require('../Images/close.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>


              <ScrollView style={{ flex: 1 }}>
                <View style={styles.alignView}>
                  <Text style={styles.modalTitle}>{lang.rate}</Text>

                  <Rating
                    type={'star'}
                    ratingCount={5}
                    imageSize={30}
                    showRating
                    fractions={1}
                    ratingBackgroundColor={Colors.red}
                    ratingTextColor={Colors.pink}
                    startingValue={rating}
                    onFinishRating={(value) => setRating(value)}
                  />
                  <TextInput
                    style={styles.comment}
                    multiline
                    numberOfLines={4}
                    placeholder={'Type comment'}
                    value={comment}
                    onChangeText={text => setComment(text)}>

                  </TextInput>

                  <View style={styles.buttonContainer}>
                    <Button text={lang.rate} func={() => rate()} color={Colors.purple} ></Button>
                    <Button text={lang.cancel} func={() => setShowModal(false)} color={Colors.red} asText={true}></Button>
                  </View>
                </View>
              </ScrollView>
            </View>

            : null}
        </View>
      </Modal>

      {/* MODAL TO SEE USER RATINGS */}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={showUserInfo}
        onRequestClose={() => setShowUserInfo(false)}
      >
        <View style={styles.centeredView}>
          {userInfo ?

            <View style={styles.modalView}>

              <TouchableOpacity
                onPress={() => setShowUserInfo(false)}
                style={{ width: 30, height: 30, position: 'absolute', top: 5, right: 0 }}>
                <Image source={require('../Images/close.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>


              <ScrollView style={{ flex: 1 }}>
                <View style={styles.alignView}>
                  <Avatar.Text
                    size={70}
                    label={userInfo.firstName?.charAt(0) + userInfo.lastName?.charAt(0)}
                    style={{ backgroundColor: stringToColour(userInfo.firstName  + " " + userInfo.lastName) }}
                    color={Colors.white} />
                  <Text style={styles.modalTitle}>{userInfo.firstName + " " + userInfo.lastName}</Text>

                  <Rating
                    type={'star'}
                    ratingCount={5}
                    imageSize={30}
                    startingValue={userInfo.rating}
                    readonly={true}
                  />

                  <View style={styles.commentSection}>
                  {userInfo.comments?.map((comment, id) => {
                    return(
                      <View style={styles.commentRow}>
                      <Text style={styles.commentText}>{comment.comment}</Text>  
                      <Text style={styles.commentBy}>{comment.employerFirstName + " " + comment.employerLastName}</Text>  
                      </View>
                    )
                  })}
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button text={lang.cancel} func={() => setShowUserInfo(false)} color={Colors.red} asText={true}></Button>
                  </View>
                </View>
              </ScrollView>
            </View>

            : null}
        </View>
      </Modal>
      {/* MAIN  */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            color={Colors.green}
            onRefresh={onRefresh}
            colors={[Colors.purple]}
            progressBackgroundColor={Colors.lightPurple}
          />
        }
      >
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
                    var currentDate = new Date();
                    var today = currentDate.toISOString().slice(0, 10) === offer.serviceDate;
                    return (<View key={id} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <MyOffersBlock
                        title={offer.title}
                        key={id}
                        id={id}
                        select={selectOffer}
                        category={offer.category}
                        date={offer.serviceDate}
                        disabled={offer.status >= 2} />
                      {offer.worker != "" && (offer.status == 1 || offer.status == 3) ?
                        <View style={styles.workerInfo}>
                          <TouchableOpacity
                            style={{ flexDirection: 'row', width: 130, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => showUser(offer.worker)}>
                            <View style={{ flexDirection: 'row', width: 40, alignItems: 'center', justifyContent: 'center' }}>
                              <Avatar.Text
                                size={40}
                                label={offer.workerFirstName?.charAt(0) + offer.workerLastName?.charAt(0)}
                                style={{ backgroundColor: stringToColour(offer.workerFirstName + " " + offer.workerLastName) }}
                                color={Colors.white} />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: 10, width: 80, alignItems: 'center', justifyContent: 'center' }}>
                              <Text>{offer.workerFirstName + " " + offer.workerLastName}</Text>
                              {offer.status == 1 ? <Text>{offer.workerPhone}</Text> : null}
                            </View>
                          </TouchableOpacity>
                          {offer.status == 1 && !today ?
                            <View style={{ flexDirection: 'row', marginLeft: 30, width: 70, alignItems: 'center', justifyContent: 'center' }}>

                              <Button text={lang.reject} func={() => reject(offer.id, offer.worker)} color={Colors.red} asText={true}></Button>

                              {offer.workerStatus === "requested" && !today ?
                                <Button text={lang.accept} func={() => accept(offer.id, offer.worker)} color={Colors.green} asText={true}></Button>
                                : null}

                            </View>
                            : offer.status == 3 ?
                              <View style={{ flexDirection: 'row', marginLeft: 40, width: 60, alignItems: 'center', justifyContent: 'center' }}>
                                {parseInt(offer.rating) == -1 ?
                                  <Button text={lang.rate} color={Colors.purple} asText={true} func={() => startRating(id)}></Button>
                                  :
                                  <Rating
                                    type={'star'}
                                    ratingCount={5}
                                    imageSize={15}
                                    readonly
                                    startingValue={rating} />}
                              </View> :
                              <View style={{ flexDirection: 'row', marginLeft: 30, width: 70, alignItems: 'center', justifyContent: 'center' }}>
                                <Button text={lang.cancel} color={Colors.red} asText={true} func={() => cancel(offer.id)}></Button>
                                <Button text={lang.finish} color={Colors.purple} asText={true} func={() => close(offer.id)}></Button>
                              </View>
                          }


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
    paddingBottom: 0,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 400,
    minWidth: 300
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
    color: Colors.purple
  },
  comment: {
    width: 250,
    margin: 10,
    backgroundColor: Colors.purpleBackground,
  },
  commentSection: {
    width: '90%',
    padding:10,
  },
  commentRow : {
    backgroundColor: Colors.purpleBackground,
    padding:10,
    flexDirection: 'column',
    marginTop:10,
  },
  commentText: {
    fontSize: 15,
    width: '100%',

  },
  commentBy:{
    fontSize: 12,
    width: '100%',
    textAlign: 'right'
  }

})

export default MyOffers