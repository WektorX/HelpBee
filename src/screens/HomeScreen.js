import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/Button';
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/core';
 
export default function HomeScreen() {
  const dispatch = useDispatch();
 
  const navigation = useNavigation();

// function to sign out from app
  const handleSignOut = () =>{
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(err => alert(err.message))
  }
 
  return (
    <View style={styles.container}>
      <Button text={"Log out"} func={handleSignOut}/>
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