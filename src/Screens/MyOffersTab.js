import { StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper';
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';



export default function MyOffers() {


  const lang = useSelector((store) => store.language.language);
  const [offers, setOffers] = useState([]);

  const newOffer = () =>{
    console.log("XD")
  }


  return (
    <View style={styles.mainView}>

      <ScrollView>

        <View style={styles.container}>
          <Text style={styles.title}>{lang.myOffersTab}</Text>
          <View>
            {offers.length > 0 ? null : <Image style={styles.emptyImage} source={require('../Images/emptyOffer.png')}></Image>}
          </View>
        </View>
     
      </ScrollView>
      {/* <FAB title="+" placement='right' color={Colors.purple} size='large' style={styles.floatingButton} /> */}
      <FAB icon={'plus'} style={styles.floatingButton} color={Colors.purple} onPress={() => newOffer()}/>

    </View>
  )
}

const styles = StyleSheet.create({
  mainView:{
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
  title:{
    fontSize:30,
    fontWeight: 'bold',
  },
  emptyImage:{
    marginTop:200,
    width:200,
    height:200
  }
})