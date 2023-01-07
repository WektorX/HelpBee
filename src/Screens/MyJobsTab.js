import { StyleSheet, Text, View, ScrollView, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper';
import Colors, { stringToColour } from '../Constants/Colors'
import { Avatar } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../Constants/Categories.js'
import { useNavigation } from '@react-navigation/core';
import { getUserJobs } from '../API/GET';
import { userJobs, userOffers } from '../redux/actions/userDataAction';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MyOffersBlock from '../Components/MyOffersBlock.js';
import Button from '../Components/Button'
import { acceptWorker, rejectWorker, withdrawOffer, closeOffer } from '../API/POST';

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await retriveJobs();
    })
    return () => {
      unsubscribe();
    }
  }, [navigation])

  const jobsStatusChange = async (event) => {
    let temp = event.nativeEvent.selectedSegmentIndex;
    setStatus(temp)
    retriveJobs(temp);
    if (temp == 0) {
      setSelectedJobs(jobs.filter(job => job.status == 1))
    }
    else {
      setSelectedJobs(jobs.filter(job => job.status != 1))
    }
  }

  const retriveJobs = async () => {
    const response = await getUserJobs(uid);
    let jobs = response.data;
    jobs = jobs.map(o => {
      let tempDate = o.serviceDate.split("T")[0];
      o.serviceDate = tempDate;
      return o
    })
    dispatch(userJobs(jobs));
  }

  const cancel = async (offerID) => {
    const response = await resignFromOffer(uid, offerID);
    await retriveJobs();
    if (status == 0) {
      setSelectedJobs(jobs.filter(job => job.status == 1))
    }
    else {
      setSelectedJobs(jobs.filter(job => job.status != 1))
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

  return (
    <View style={styles.mainView}>
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
                          select={() => console.log("XD")}
                          category={offer.category}
                          date={offer.serviceDate}
                          color={Colors.green} />
                        <View style={styles.workerInfo}>
                          <View style={{ flexDirection: 'row', width: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar.Text
                              size={45}
                              label={offer.employerFirstName?.charAt(0) + offer.employerLastName?.charAt(0)}
                              style={{ backgroundColor: stringToColour(offer.employerFirstName + " " + offer.employerLastName) }}
                              color={Colors.white} />
                          </View>
                          <View style={{ flexDirection: 'column', width: 80, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{offer.employerFirstName + " " + offer.employerLastName}</Text>
                            <Text>{offer.employerPhone}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', marginLeft: 30, width: 70, alignItems: 'center', justifyContent: 'center' }}>
                            {offer.status == 1 ?
                              <Button text={lang.reject} func={() => cancel(offer.userID)} color={Colors.red} asText={true}></Button>
                              :
                              <Button text={lang.rate} color={Colors.green} asText={true} func={() => console.log("rate")}></Button>
                            }
                          </View>
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