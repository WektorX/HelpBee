import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper';
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../Constants/Categories.js'
import { useNavigation } from '@react-navigation/core';
import { getUserOffers } from '../API/GET';
import { userFirstName, userLastName, userPhoneNumber, userBirthDate, userOffers } from '../redux/actions/userDataAction';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MyOffersBlock from '../Components/MyOffersBlock.js';

const MyOffers = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const lang = useSelector((store) => store.language.language);
  const location = useSelector((store) => store.user.location);
  const uid = useSelector((store) => store.user.uid);
  const offers = useSelector((store) => store.user.offers)
  const [status, setStatus] = useState(0);
  const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);
  const [selectedOffers, setSelectedOffers] = useState(offers.filter(item => item.status === 0))


  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', async () => {
      // to add get all offers
      const response = await getUserOffers(uid);
      let offers = response.offers.data;
      offers = offers.map(o => {
        let tempDate = o.serviceDate.split("T")[0];
        o.serviceDate = tempDate;
        return o
      })
      dispatch(userOffers(offers))
      setStatus(0)
      setSelectedOffers(offers.filter(item => item.status === 0))
      setCategories(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);
    })

    return () => {
      unsubscribe();
    }

  }, [navigation])

  const newOffer = () => {
    navigation.navigate("NewOffer", { location: location });
  }

  const offerStatusChange = (event) => {
    let status = event.nativeEvent.selectedSegmentIndex;
    setStatus(status)
    setSelectedOffers(offers.filter(item => item.status === status))
  }
  
  const selectOffer = (id) => {
    if(selectedOffers[id].status === 0 || selectedOffers[id].status === 1){
      navigation.navigate("EditOffer", selectedOffers[id]);
    }
    else{
      console.log("global view")
    }
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
                    return (<MyOffersBlock 
                      title={offer.title}
                       key={id}
                       id={id}
                       select={selectOffer}
                       category={offer.category}
                       date={offer.serviceDate}/>)
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
  offersBlocks:{
    marginTop:20,
  }
})

export default MyOffers