import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export default class Button extends Component {
    render() {
        let style = {
            button : null,
            text : null
        };

        if(this.props.outline){
            style.button = styles.buttonOutline;
            style.text = styles.buttonOutlineText 
        }
        if(this.props.asText){
            style.button = styles.buttonAsText;
            style.text = styles.buttonAsTextText 
        }

        return (

                <TouchableOpacity
                    onPress={() => {this.props.func()}}
                    style={[styles.button, style.button ]}
                >
                    <Text style={[styles.buttonText , style.text]}>{this.props.text}</Text>
                </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({

    button:{
        backgroundColor : 'white',
        borderRadius: 10,
        marginTop: 5,
        width: '100%',
        padding : 15,
        backgroundColor: '#ffcb05',
        alignItems: 'center'
    },
    buttonOutline:{
        backgroundColor: 'white',
        borderColor: '#ffcb05',
        borderWidth: 2
    },
    buttonAsText:{
        backgroundColor : 'rgba(0,0,0,0)',
        color : '#ffcb05',
        borderWidth: 0,
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText:{
        color: '#ffcb05',
        fontWeight: '700',
        fontSize: 16
    },
    buttonAsTextText:{
        color: '#ffcb05',
        fontWeight: '700',
        fontSize: 16
    }
})