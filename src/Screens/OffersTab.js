import { StyleSheet, Text, View, ScrollView, Image, PermissionsAndroid } from 'react-native'
import * as Location from "expo-location"
import React, { useEffect, useState } from 'react'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import AwesomeAlert from 'react-native-awesome-alerts';
import { userLocation } from '../redux/actions/userDataAction';
import { updateUserLocation } from '../API/POST';
import CategoryButton from '../Components/CategoryButton';
import Categories from '../Constants/Categories'
import { Icons } from '../Components/Icons';

export default function Offers() {

  //use navigator
  const navigation = useNavigation();
  //use redux store
  const dispatch = useDispatch();

  const lang = useSelector((store) => store.language.language);
  const uid = useSelector((store) => store.user.uid);
  const location = useSelector((store) => store.user.location)
  const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);

  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [locationPermission, setLocationPermission] = useState(true)
  const [askPermission, setAskPermission] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          let locationObj = {
            Latitude: location.coords.latitude,
            Longitude: location.coords.longitude
          }
          handleLocationChange(locationObj);
          updateUserLocation(uid, locationObj);
          setLocationPermission(true);
        }
        else {
          setAlertMsg(lang.locationDenied);
          setAlertTitle(lang.oops);
          setShowAlert(true);
          setLocationPermission(false);

        }
      }
      catch (e) {
        console.log(e)
      }

    })()
  }, [locationPermission])


  useEffect(() => {
    setCategories(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN)
  }, [lang])

  const handleLocationChange = (value) => {
    dispatch(userLocation(value))
  }

  const chooseCategory = (category) => {
    navigation.navigate("CategoryOffers", { category: category })
  }

  return (
    <View style={styles.mainView}>

      <ScrollView>

        {locationPermission ?
          <View style={styles.container}>
            <View style={styles.categoryContainer}>
              {
                categories.map((item, index) => {
                  return (
                    <CategoryButton
                      function={chooseCategory}
                      icon={item.icon + "-outline"}
                      name={item.name}
                      key={index}
                      type={Icons.Ionicons}
                      category={item.id}
                    >
                    </CategoryButton>
                  )
                })
              }
            </View>
          </View>
          :
          <View style={styles.container}>
            <Text style={styles.title}>{lang.offersTab}</Text>

            <Text style={styles.noAccessText}>{lang.noAccessToOffers}</Text>
          </View>
        }


      </ScrollView>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMsg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={Colors.primary}
        onConfirmPressed={() => setShowAlert(false)}
      />
    </View>
  )
}

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
  floatingButton: {
    position: 'absolute',
    margin: 16,
    bottom: 70,
    right: 10,

  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.black
  },
  noAccessText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 300,
  },
  filters: {
    flex: 1,
    marginTop: 30,
    minWidth: 200,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center'
  }

})