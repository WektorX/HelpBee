import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import * as Animatable from 'react-native-animatable'
import Icon, { Icons } from '../Components/Icons';
import Colors from '../Constants/Colors';


export default function TabButton(props) {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const textViewRef = useRef(null);
  
    useEffect(() => {
      if (focused) { // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
        viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
        textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
      } else {
        viewRef.current.animate({ 0: { scale: 1, }, 1: { scale: 0, } });
        textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
      }
    }, [focused])
  
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[styles.container, {flex: focused ? 1 : 0.65}]}>
        <View>
          <Animatable.View
            ref={viewRef}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }]} />
          <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaColor }]}>
            <Icon type={item.type} name={item.icon} color={'white'} />
            <Animatable.View
              ref={textViewRef}>
              {focused && <Text style={{
                color: '#fff', paddingHorizontal: 8
              }}>{item.label}</Text>}
            </Animatable.View>
          </View>
        </View>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.pureAlpha,
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 16,
    }
  })