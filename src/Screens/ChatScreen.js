import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Colors, { stringToColour } from '../Constants/Colors'
import Icon, { Icons } from '../Components/Icons';
import { useNavigation } from '@react-navigation/core';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Checkbox, TextInput } from 'react-native-paper'
import Button from '../Components/Button'
import { WaveIndicator } from 'react-native-indicators';
import { sendMsgToChat } from '../API/POST';
import { getMessages } from '../API/GET';

const ChatScreen = (props) => {

    //use navigator
    const navigation = useNavigation();
    const lang = useSelector((store) => store.language.language);
    const location = useSelector((store) => store.user.location);
    const uid = useSelector((store) => store.user.uid);
    const distance = useSelector((store) => store.user.distance);
    const [msg, setMsg] = useState('');
    const [numerOfLines, setNumberOfLines] = useState(1)
    const [messages, setMessages] = useState([])

    const scrollViewRef = useRef();

    const MINUTE_MS = 1000;

    useEffect(() => {
      const interval = setInterval(() => {
            refreshMessagess();
      }, MINUTE_MS);
    
      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])


    useEffect(() => {
        refreshMessagess();
    }, [])

    const refreshMessagess = async() =>{
        const response = await getMessages(props.route.params.offer.userID, props.route.params.offer.worker, props.route.params.offer.id)
        let tempMessages = response.data.chat;
        if(tempMessages.length > messages.length){
            tempMessages.map((item) => {
                item.sendDate = new Date(item.sendDate);
                return item
            })
            
            tempMessages = tempMessages.sort((a, b) => {return a.sendDate - b.sendDate})
            setMessages(tempMessages)
        }
    }

    const handleTyping = (text) => {
        let temp = Math.ceil(text.length / 36);
        temp = temp > 0 ? temp : 1;
        setMsg(text)
        setNumberOfLines(temp)
    }

    const goBack = () => {
        navigation.goBack();
    }

    const sendMsg = async () => {
        if(msg != ""){
            let msgObj = {
                message: msg,
                sendDate: new Date(),
                senderID: uid
            }
            sendMsgToChat(props.route.params.offer.userID, props.route.params.offer.worker, props.route.params.offer.id,  msgObj)
            setMessages(old => [...old, msgObj]);
            setMsg("");
            setNumberOfLines(1);
        }
    }

    return (
        <View style={[styles.mainView, { backgroundColor: props.route.params.who === 'worker' ? Colors.greenBackground : Colors.purpleBackground }]}>
            <View style={[styles.header, { backgroundColor: props.route.params.who === 'worker' ? Colors.green : Colors.purple }]}>
                <TouchableOpacity onPress={goBack}>
                    <Icon style={styles.backIcon} type={Icons.Ionicons} name={'arrow-back-outline'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{props.route.params.offer.title}</Text>
            </View>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <View style={styles.container}>

                    {messages.map((item, id) => {
                        return (
                            <View style={item.senderID === uid ? styles.sendMsgRow : styles.receivedMsgRow} key={id}>
                                <Text
                                    style={[{ backgroundColor: props.route.params.who === 'worker' ? Colors.green : Colors.purple }, item.senderID === uid ? styles.sendMsg : styles.receivedMsg]}>
                                    {item.message}
                                </Text>
                            </View>
                        )
                    })}


                </View>
            </ScrollView>
            <View style={styles.msgInputContainer}>
                <TextInput
                    placeholder={lang.typeMsg}
                    onChangeText={text => handleTyping(text)}
                    style={styles.msgInput}
                    multiline={numerOfLines > 1}
                    numberOfLines={numerOfLines}
                    value={msg}
                >
                </TextInput>
                <View style={styles.sendButton}>
                    <Button
                        asText={true}
                        text={lang.send}
                        func={sendMsg}
                        color={props.route.params.who === 'worker' ? Colors.green : Colors.purple}
                    ></Button>

                </View>
            </View>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.primaryBackground
    },
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 100,
        minWidth: 100,
    },
    header: {
        width: '100%',
        height: 80,
        color: Colors.white,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    backIcon: {
        color: Colors.white,
        padding: 20,
    },
    msgInputContainer: {
        flexDirection: 'row',
        width: window.width,
        padding: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white
    },
    msgInput: {
        backgroundColor: Colors.pureAlpha,
        width: 270
    },
    sendButton: {
        width: 70
    },
    sendMsgRow: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 5
    },
    receivedMsgRow: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 5
    },
    sendMsg: {
        color: Colors.white,
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    receivedMsg: {
        color: Colors.black,
        padding: 10,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    }
})