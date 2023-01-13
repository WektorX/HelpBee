import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from './Icons'
import Colors from '../Constants/Colors'

const CategoryButton = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => props.function(props.category)}>
                <Icon style={styles.icon} type={props.type} name={props.icon} />
                <Text style={styles.text}>{props.name}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CategoryButton

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        backgroundColor: Colors.primary,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,

    },
    icon: {
        height: 60,
        fontSize: 50,
        textAlign: 'center',
        color: Colors.white,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.white,
    }

})