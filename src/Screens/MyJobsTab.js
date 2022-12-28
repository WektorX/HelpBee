import { StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
export default function MyJobs() {

  const lang = useSelector((store) => store.language.language);

  return (
    <View style={styles.mainView}>

      <ScrollView>

        <View style={styles.container}>
          <Text style={styles.title}>{lang.myJobsTab}</Text>

        </View>
     
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  mainView:{
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
  title:{
    fontSize:30,
    fontWeight: 'bold',
  },

})