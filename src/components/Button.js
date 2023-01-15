import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Colors from '../Constants/Colors';
import Icon from '../Components/Icons';

export default class Button extends Component {
    render() {
        let style = {
            button: styles.buttonFilled,
            text: styles.buttonFilledText,
            icon: styles.icon
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
            var iconTextStyle = JSON.stringify(style.icon).replace(reg, this.props.color)
            style.button = JSON.parse(buttonStyleSTR);
            style.text = JSON.parse(textStyleSTR);
            style.icon = JSON.parse(iconTextStyle)
        }

        return (

            <TouchableOpacity
                onPress={() => { this.props.func() }}
                style={[styles.button, style.button]}
            >
                {this.props.icon? 
                <Icon style={style.icon} type={this.props.type} name={this.props.icon} />
                : null}
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
        flexDirection: 'row'
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
    },
    icon: {
        height: 30,
        fontSize: 30,
        textAlign: 'center',
        color: Colors.primary,
    },
})