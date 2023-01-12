import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Button from '../Components/Button'
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { userPreferences, userDistance } from '../redux/actions/userDataAction';
import { insertBasicUserData, setPreferences } from '../API/POST';
import { Slider } from '@miblanchard/react-native-slider';
import Colors from '../Constants/Colors';
import Categories from '../Constants/Categories.js'
import CategorySelect from '../Components/CategorySelect';

const UserPreferencesScreen = () => {

    //use navigator
    const navigation = useNavigation();
    //use redux store
    const dispatch = useDispatch();
    //get state from redux store
    const lang = useSelector((store) => store.language.language);
    const uid = useSelector((store) => store.user.uid);
    const distance = useSelector((store) => store.user.distance);
    const preferences = useSelector((store) => store.user.preferences);


    //local states
    const [categories, setCategories] = useState(lang.language === 'pl' ? Categories.categoriesPL : Categories.categoriesEN);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        setCategory(preferences)
    }, [])


    const selectCategory = (id) => {
        // let temp = category;
        if (category?.indexOf(id) < 0) {
            setCategory([
                ...category,
                id
            ])
        }
        else {
            setCategory(category?.filter(item => item !== id))
        }
    }

    const savePreferences = async () => {
        await dispatch(userPreferences(category))
        const response = await setPreferences(uid, distance, category)
        goBack();
    }

    const goBack = () => {
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.title}>{lang.preferences}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.distanceText}>
                    {distance} KM
                </Text>
                <Slider
                    value={distance}
                    onValueChange={(value) => dispatch(userDistance(value[0]))}
                    animateTransitions={true}
                    animationType={'spring'}
                    maximumValue={100}
                    minimumValue={1}
                    step={5}
                    thumbTintColor={Colors.green}
                    trackStyle={{ backgroundColor: Colors.greenAlpha }}
                    minimumTrackTintColor={Colors.greenAlpha}
                />
                <View >
                    {
                        categories.map((item, id) => {
                            let s = category?.indexOf(item.id) > -1;
                            return (
                                <CategorySelect color={Colors.green} key={id} selected={s} name={item.name} id={item.id} select={() => selectCategory(item.id)} />
                            )
                        })
                    }
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button text={lang.save} func={savePreferences} color={Colors.green}></Button>

                <Button text={lang.cancel} func={goBack} asText={true} color={Colors.green}></Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export default UserPreferencesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingTop: 100
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.green,
    },
    inputContainer: {
        width: '80%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    categoriesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
})