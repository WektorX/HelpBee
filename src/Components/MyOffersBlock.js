import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Categories from '../Constants/Categories.js'
import Icon, { Icons } from '../Components/Icons';
import Colors from '../Constants/Colors.js';

const MyOffersBlock = (props) => {

  return (
    <TouchableOpacity onPress={() => props.select(props.id)} disabled={ props.disabled }>
    <View style={[styles.container, (props.color ? {backgroundColor: props.color} : null)]}>
      <View style={styles.iconConatiner}>
        <Icon type={Icons.Ionicons}
          name={Categories.categoriesEN.filter(item => item.id === props.category)[0].icon}
          style={styles.icon} 
          />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.date}>{props.date}</Text>
        {props.distance ? <Text style={styles.distance}>{props.distance.toFixed(2)}KM</Text> : null}
        
      </View>
    </View>
    </TouchableOpacity>
  )
}

export default MyOffersBlock

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.purpleAlpha,
    justifyContent: 'space-between',
    width: 300,
    marginTop:5,
  },
  iconConatiner: {
    flexDirection: 'column',
    width:50,
    height:50,
  },
  icon:{
    width:50,
    height:50,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 45,
    color: Colors.white
  },
  textContainer: {
    flex: 2,
    padding:5,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center'
  },
  date: {
    fontSize:10,
    color: Colors.white,
    textAlign: 'center'
  },
  distance:{
    fontSize:10,
    color: Colors.white,
    textAlign: 'center'
  }
})