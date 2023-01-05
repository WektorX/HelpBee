import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CategoryOffersScreen = (props) => {
  return (
    <View>
      <Text>{props.route.category}</Text>
    </View>
  )
}

export default CategoryOffersScreen

const styles = StyleSheet.create({})