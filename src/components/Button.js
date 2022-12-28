import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Colors from '../Constants/Colors';

export default class Button extends Component {
    render() {
        let style = {
            button: styles.buttonFilled,
            text: styles.buttonFilledText
        };

        if (this.props.outline) {
            style.button = styles.buttonOutline;
            style.text = styles.buttonOutlineText
        }
        if (this.props.asText) {
            style.button = styles.buttonAsText;
            style.text = styles.buttonAsTextText
        }
        if (this.props.color) {
            let color = Colors.primary
            let reg = new RegExp(color, "g");
            var buttonStyleSTR = JSON.stringify(style.button).replace(reg, this.props.color);
            var textStyleSTR = JSON.stringify(style.text).replace(reg, this.props.color);
            style.button = JSON.parse(buttonStyleSTR);
            style.text = JSON.parse(textStyleSTR);
        }

        return (

            <TouchableOpacity
                onPress={() => { this.props.func() }}
                style={[styles.button, style.button]}
            >
                <Text style={[styles.buttonText, style.text]}>{this.props.text}</Text>
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({

    button: {
        borderRadius: 10,
        marginTop: 5,
        width: '100%',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    buttonFilled: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderWidth: 2
    },
    buttonOutline: {
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    buttonAsText: {
        backgroundColor: Colors.pureAlpha,
        color: Colors.primary,
        shadowColor: Colors.pureAlpha
        
    },
    buttonText: {
        color: Colors.white,
        fontWeight:'500'
    },
    buttonFilledText: {
        color: Colors.white,
    },
    buttonOutlineText: {
        color: Colors.primary,
    },
    buttonAsTextText: {
        color: Colors.primary,
    }
})