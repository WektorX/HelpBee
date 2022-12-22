import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Constants/Colors'
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail } from '../redux/actions/userDataAction';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/Button';

export default function MyAccount() {

  const dispatch = useDispatch();

  const email = useSelector((store) => store.user.email);
  const userAuthObj = useSelector((store) => store.user.userAuth);
  const lang = useSelector((store) => store.language.language);

  const navigation = useNavigation();


  // function to sign out from app
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        // clear the redux store
        () => handleEmailChange("");
        navigation.replace("Login");
      })
      .catch(err => alert(err.message))
  }

  const handleEmailChange = (value) => {
    dispatch(userEmail(value))
  }

  return (
    <View style={styles.container}>
      <Button text={"Log out"} func={handleSignOut} />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    paddingTop: 50,
  }
})