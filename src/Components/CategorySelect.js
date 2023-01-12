import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../Constants/Colors'

const CategorySelect = (props) => {
    return (

        <TouchableOpacity onPress={() => props.select(props.id)} disabled={props.disabled}>
            <View
                style={
                    [styles.conatiner,
                    (props.selected ? styles.selected : null),
                    (props.color != null? {borderColor: props.color} : null),
                    (props.color != null && props.selected ? { backgroundColor: props.color } : null)]}>
                <Text style={props.selected ? { fontWeight: 'bold', color: Colors.white } : null}>
                    {props.name}
                </Text>
            </View>
        </TouchableOpacity>


    )
}

export default CategorySelect

const styles = StyleSheet.create({
    conatiner: {
        borderWidth: 1,
        borderColor: Colors.purple,
        padding: 10,
        height: 40,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        margin: 2,
    },
    selected: {
        color: Colors.white,
        backgroundColor: Colors.purple,
    }
})