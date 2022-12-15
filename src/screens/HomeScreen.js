import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/Button';
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail } from '../redux/actions/userDataAction';
export default function HomeScreen() {
  const dispatch = useDispatch();

  const email = useSelector((store) => store.user.email);
  const userAuthObj = useSelector((store) => store.user.userAuth);


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
    alert("value: "+ value)
    dispatch(userEmail(value))
  }

  return (
    <View style={styles.container}>
      <Button text={"Log out"} func={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 50,
  },
});