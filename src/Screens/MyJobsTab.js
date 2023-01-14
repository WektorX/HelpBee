import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper';
import Colors, { stringToColour } from '../Constants/Colors'
import { Avatar } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { getUserJobs } from '../API/GET';
import { userJobs } from '../redux/actions/userDataAction';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MyOffersBlock from '../Components/MyOffersBlock.js';
import Button from '../Components/Button'
import { resignFromOffer, insertRate } from '../API/POST';
import { Rating } from 'react-native-ratings';

export default function MyJobs() {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const lang = useSelector((store) => store.language.language);
  const location = useSelector((store) => store.user.location);
  const uid = useSelector((store) => store.user.uid);
  const jobs = useSelector((store) => store.user.jobs)

  const [status, setStatus] = useState(0);
  const [selectedJobs, setSelectedJobs] = useState(jobs.filter(item => item.status == 1))
  const [refreshing, setRefreshing] = useState(false);
  const [offerToRate, setOfferToRate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', async () => {
      retriveJobs();
    })
    return () => {
      unsubscribe();
    }
  }, [navigation])

  useEffect(() => {
    if (status == 0) {
      setSelectedJobs(jobs.filter(job => job.status == 1))
    }
    else {
      setSelectedJobs(jobs.filter(job => job.status != 1))
    }
  }, [jobs])

  const jobsStatusChange = async (event) => {
    let temp = event.nativeEvent.selectedSegmentIndex;
    setStatus(temp)
    if (temp == 0) {
      setSelectedJobs(jobs.filter(job => job.status == 1))
    }
    else {
      setSelectedJobs(jobs.filter(job => job.status != 1))
    }
    await retriveJobs(temp);
  }

  const retriveJobs = async (status) => {
    const response = await getUserJobs(uid);
    let jobs = response.data;
    jobs = jobs.map(o => {
      let tempDate = o.serviceDate.split("T")[0];
      o.serviceDate = tempDate;
      return o
    })
    dispatch(userJobs(jobs));
  }

  const cancel = async (offerID, userID, title) => {
    const response = await resignFromOffer(userID, uid, offerID, title);
    if (response.status === 200) {
      let index = jobs.indexOf(job => job.id === offerID);
      let temp = jobs.splice(index, 1);
      dispatch(userJobs(temp))
      retriveJobs();
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await retriveJobs();
    if (status == 0) {
      setSelectedJobs(jobs.filter(job => job.status == 1))
    }
    else {
      setSelectedJobs(jobs.filter(job => job.status != 1))
    }
    setRefreshing(false)
  }


  const startRating = (id) => {
    setShowModal(true);
    setOfferToRate(selectedJobs[id]);
  }

  const rate = async () => {
    let ratings = {
      category: offerToRate.category,
      comment: comment,
      employerID: offerToRate.userID,
      offerID: offerToRate.id,
      rating: rating,
      workerID: offerToRate.worker,
      who: 'worker'
    }
    const response = await insertRate(ratings);
    if (response.status == 200) {
      let index = selectedJobs.findIndex(item => item.id === offerToRate.id);
      let temp = selectedJobs;
      temp[index].rating = rating;
      setSelectedJobs(temp);
    }
    setShowModal(false)
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
                    <Button text={lang.rate} func={() => rate()} color={Colors.green} ></Button>
                    <Button text={lang.cancel} func={() => setShowModal(false)} color={Colors.red} asText={true}></Button>
                  </View>
                </View>
              </ScrollView>
            </View>

            : null}
        </View>
      </Modal>


      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            color={Colors.green}
            onRefresh={onRefresh}
            colors={[Colors.green]}
            progressBackgroundColor={Colors.green2}
          />
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>{lang.jobsTab}</Text>
          <SegmentedControl
            values={lang.jobsStatus}
            selectedIndex={status}
            onChange={(event) => jobsStatusChange(event)}
            style={styles.segmentedButton}
            tintColor={Colors.green}
            backgroundColor={Colors.greenBackground}
            fontStyle={{ color: Colors.black }}
            activeFontStyle={{ color: Colors.white }}
          />
          <View>
            {selectedJobs.length > 0 ?
              <View style={styles.offersBlocks}>
                {
                  selectedJobs.map((offer, id) => {
                    var currentDate = new Date();
                    var today = currentDate.toISOString().slice(0, 10) === offer.serviceDate;
                    return (
                      <View key={id} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MyOffersBlock
                          title={offer.title}
                          key={id}
                          id={id}
                          select={() => console.log()}
                          disabled={true}
                          category={offer.category}
                          date={offer.serviceDate}
                          color={Colors.green} />
                        <View style={styles.workerInfo}>
                          <View style={{ flex: 1, flexDirection: 'row', maxWidth: offer.status == 1 ? 50 : 100, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar.Text
                              size={45}
                              label={offer.employerFirstName?.charAt(0) + offer.employerLastName?.charAt(0)}
                              style={{ backgroundColor: stringToColour(offer.employerFirstName + " " + offer.employerLastName) }}
                              color={Colors.white} />
                          </View>
                          <View style={{ flex: 1, flexDirection: 'column', maxWidth: offer.status == 1 ? 90 : 120, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{offer.employerFirstName + " " + offer.employerLastName.charAt(0) + "."}</Text>
                          </View>
                          {offer.status == 1 ?
                            <View style={{ flexDirection: 'row', marginLeft: 20, width: 70, alignItems: 'center', justifyContent: 'center' }}>
                              <Button text={lang.reject} func={() => cancel(offer.id, offer.userID, offer.title)} color={Colors.red} asText={true}></Button>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', marginLeft: 20, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                              {parseInt(offer.rating) == -1 ?
                                <Button text={lang.rate} color={Colors.green} asText={true} func={() => startRating(id)}></Button>
                                :
                                <Rating
                                  type={'star'}
                                  ratingCount={5}
                                  imageSize={15}
                                  readonly
                                  startingValue={offer.rating} />}
                            </View>
                          }
                        </View>
                      </View>)
                  })
                }
              </View>

              :
              <Image style={styles.emptyImage} source={require('../Images/emptyOffer.png')}></Image>}
          </View>
        </View>
      </ScrollView>
      <FAB icon={'tooltip-outline'} style={styles.floatingButton} color={Colors.green2} col onPress={() => navigation.navigate('UserPreferences')} />

    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.greenBackground
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
  floatingButton: {
    position: 'absolute',
    margin: 16,
    bottom: 70,
    right: 10,
    backgroundColor: Colors.green
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
    color: Colors.green
  },
  comment: {
    width: 250,
    margin: 10,
    backgroundColor: Colors.greenBackground,
    padding: 10
  },
  commentSection: {
    width: '90%',
    padding: 10,
    marginBottom: 20
  },
  commentRow: {
    backgroundColor: Colors.greenBackground,
    padding: 10,
    flexDirection: 'column',
    marginTop: 10,
  },
  commentText: {
    fontSize: 15,
    width: '100%',

  },
  commentBy: {
    fontSize: 12,
    width: '100%',
    textAlign: 'right'
  },
  buttonContainer: {
    width: '60%',
  },
})