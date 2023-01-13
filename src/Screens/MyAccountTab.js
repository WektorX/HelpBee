import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Colors, { stringToColour } from '../Constants/Colors'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail, userFirstName, userLastName, userPhoneNumber, userBirthDate } from '../redux/actions/userDataAction';
import { polish, english } from '../redux/actions/languageAction';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from 'react-native-paper'
import Button from '../Components/Button';
import { Rating } from 'react-native-ratings';
import { getUserRating } from '../API/GET';

export default function MyAccount() {

  const dispatch = useDispatch();

  const email = useSelector((store) => store.user.email);
  const uid = useSelector((store) => store.user.uid);
  const lang = useSelector((store) => store.language.language);
  const firstName = useSelector((store) => store.user.firstName);
  const lastName = useSelector((store) => store.user.lastName);
  const phoneNumber = useSelector((store) => store.user.phoneNumber);
  const birthDate = useSelector((store) => store.user.birthDate);

  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [userRating, setUserRating] = useState({});

  // function to sign out from app
  const handleSignOut = () => {
    handleEmailChange("");
    handleFirstNameChange("");
    handleLastNameChange("");
    handlePhoneNumberChange("");
    handleBirthDateChange("");
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        })
      })
      .catch(err => alert(err.message))
  }
  //set email 
  const handleEmailChange = (value) => {
    dispatch(userEmail(value))
  }
  //set first name 
  const handleFirstNameChange = (value) => {
    dispatch(userFirstName(value))
  }
  //set last name 
  const handleLastNameChange = (value) => {
    dispatch(userLastName(value))
  }
  //set phone number 
  const handlePhoneNumberChange = (value) => {
    dispatch(userPhoneNumber(value))
  }
  //set birth date
  const handleBirthDateChange = (value) => {
    dispatch(userBirthDate(value))
  }
  //change language
  const changeLang = () => {
    lang.language === 'pl' ? dispatch(english()) : dispatch(polish())
  }

  const editProfile = () => {
    navigation.navigate("UserData", { action: "edit" });
  }

  const changePassword = () => {
    navigation.navigate("ChangePassword")
  }

  const showUserRating = async () => {
    const response = await getUserRating(uid);
    setUserRating(response.data)
    setShowModal(true);
  }

  return (
    <View style={styles.mainView}>


      {/* MODAL to see user rating */}

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.centeredView}>
          {userRating ?

            <View style={styles.modalView}>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{ width: 30, height: 30, position: 'absolute', top: 5, right: 0 }}>
                <Image source={require('../Images/close.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>


              <ScrollView style={{ flex: 1 }}>
                <View style={styles.alignView}>
                  <Avatar.Text
                    size={70}
                    label={firstName?.charAt(0) + lastName?.charAt(0)}
                    style={{ backgroundColor: stringToColour(firstName + " " + lastName) }}
                    color={Colors.white} />
                  <Text style={styles.modalTitle}>{firstName + " " + lastName}</Text>

                  <Rating
                    type={'star'}
                    ratingCount={5}
                    imageSize={30}
                    startingValue={userRating.rating}
                    readonly={true}
                  />

                  <View style={styles.commentSection}>
                    {userRating.comments?.map((comment, id) => {
                      return (
                        <View style={styles.commentRow} key={id}>
                          <Text style={styles.commentText}>{comment.comment}</Text>
                          <Text style={styles.commentBy}>{comment.employerFirstName + " " + comment.employerLastName}</Text>
                        </View>
                      )
                    })}
                    {userRating.comments?.length == 0 ?
                      <View style={[styles.commentRow, { paddingBottom: 50 }]}>
                        <Text style={styles.commentText}>{lang.noComments}</Text>
                      </View>
                      : null}
                  </View>
                  <View style={[styles.buttonContainer, { position: 'relative', bottom: 0 }]}>
                    <Button text={lang.cancel} func={() => setShowModal(false)} color={Colors.red} asText={true}></Button>
                  </View>
                </View>
              </ScrollView>
            </View>

            : null}
        </View>
      </Modal>




      <ScrollView >

        <View style={styles.container}>

          <View style={[styles.rows, styles.avatarContainer]}>
            <Avatar.Text
              size={80}
              label={firstName.charAt(0) + lastName.charAt(0)}
              style={{ backgroundColor: stringToColour(firstName + " " + lastName) }}
              color={Colors.white} />
            <Text style={styles.text}>{firstName + " " + lastName}</Text>
            <Text>{email}</Text>
          </View>

          <Button text={lang.seeRating} func={() => showUserRating()} color={Colors.red} asText={false} />
          <Button text={lang.editProfile} func={editProfile} color={Colors.primary} asText={false} />
          <Button text={lang.changePassword} func={changePassword} color={Colors.green} asText={false} />
          <Button text={lang.changeLanguage} func={changeLang} color={Colors.purple} asText={false} />
          <Button text={lang.logout} func={handleSignOut} color={Colors.red} asText={true} />

        </View>
      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.redBackground
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    flexDirection: 'column',
    alignItems: 'center',

  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    alignItems: 'center'
  },
  avatarContainer: {
    flex: 2,
    marginBottom: 50
  },
  text: {
    width: '100%',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
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
  commentSection: {
    width: '90%',
    padding: 10,
    marginBottom: 20
  },
  commentRow: {
    backgroundColor: Colors.purpleBackground,
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