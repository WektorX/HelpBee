import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/Button';
import * as Animatable from 'react-native-animatable'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/core';
import { userEmail } from '../redux/actions/userDataAction';
import Offers from './OffersTab';
import MyOffers from './MyOffersTab';
import MyAccount from './MyAccountTab';
import MyJobs from './MyJobsTab';
import Icon, { Icons } from '../Components/Icons';
import TabButton from '../Components/TabButton';
import Colors from '../Constants/Colors';
import { useEffect, useState } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';


const HomeScreen = () => {
  const dispatch = useDispatch();

  const email = useSelector((store) => store.user.email);
  const userAuthObj = useSelector((store) => store.user.userAuth);
  const lang = useSelector((store) => store.language.language);

  const navigation = useNavigation();

  const Tabs = [
    { route: 'Offers', label: lang.offersTab, type: Icons.Ionicons, icon: 'megaphone-outline', component: Offers, color: Colors.primary, alphaColor: Colors.primaryAlpha },
    { route: 'MyJobs', label: lang.jobsTab, type: Icons.Ionicons, icon: 'construct-outline', component: MyJobs, color: Colors.green, alphaColor: Colors.greenAlpha },
    { route: 'MyOffers', label: lang.myOffersTab, type: Icons.Ionicons, icon: 'easel-outline', component: MyOffers, color: Colors.purple, alphaColor: Colors.purpleAlpha },
    { route: 'MyAccount', label: lang.myAccountTab, type: Icons.Ionicons, icon: 'person-outline', component: MyAccount, color: Colors.red, alphaColor: Colors.redAlpha },

  ]

  const Tab = createBottomTabNavigator();

  const handleEmailChange = (value) => {
    dispatch(userEmail(value))
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16,
          backgroundColor: Colors.white
        }
      }}
    >
      {Tabs.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexDirection: 'column',
    padding: 50,
  },
});

export default HomeScreen