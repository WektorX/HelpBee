import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import Colors, { stringToColour } from '../Constants/Colors'
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail, userFirstName, userLastName, userPhoneNumber, userBirthDate } from '../redux/actions/userDataAction';
import { polish, english } from '../redux/actions/languageAction';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from 'react-native-paper'
import Button from '../Components/Button';


export default function MyAccount() {

  const dispatch = useDispatch();

  const email = useSelector((store) => store.user.email);
  const userAuthObj = useSelector((store) => store.user.userAuth);
  const lang = useSelector((store) => store.language.language);
  const firstName = useSelector((store) => store.user.firstName);
  const lastName = useSelector((store) => store.user.lastName);
  const phoneNumber = useSelector((store) => store.user.phoneNumber);
  const birthDate = useSelector((store) => store.user.birthDate);

  const navigation = useNavigation();


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
          routes: [{name: 'Login'}]
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
  const changeLang = () =>{
    lang.language === 'pl' ? dispatch(english()) : dispatch(polish())
  }

  const editProfile = () => {
    navigation.navigate("UserData", {action : "edit"});
  }

  const changePassword = () => {
    navigation.navigate("ChangePassword")
  }

  return (
    <View style={styles.mainView}>

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

          <Button text={lang.editProfile} func={editProfile} color={Colors.red} asText={true} />
          <Button text={lang.changePassword} func={changePassword} color={Colors.red} asText={true} />
          <Button text={lang.changeLanguage} func={changeLang} color={Colors.red} asText={true}/>
          <Button text={lang.logout} func={handleSignOut} color={Colors.red} />
          
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
  }
})