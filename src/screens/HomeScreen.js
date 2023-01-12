import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userOffers, userJobs } from '../redux/actions/userDataAction';
import Offers from './OffersTab';
import MyOffers from './MyOffersTab';
import MyAccount from './MyAccountTab';
import MyJobs from './MyJobsTab';
import Icon, { Icons } from '../Components/Icons';
import TabButton from '../Components/TabButton';
import Colors from '../Constants/Colors';
import { useEffect } from 'react';
import { getUserJobs, getUserOffers } from '../API/GET';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const uid = useSelector((store) => store.user.uid);
  const lang = useSelector((store) => store.language.language);
  const distance = useSelector((store) => store.language.distance);
  const preferences = useSelector((store) => store.language.preferences);



  const Tabs = [
    { route: 'Offers', label: lang.offersTab, type: Icons.Ionicons, icon: 'megaphone-outline', component: Offers, color: Colors.primary, alphaColor: Colors.primaryAlpha },
    { route: 'MyJobs', label: lang.jobsTab, type: Icons.Ionicons, icon: 'construct-outline', component: MyJobs, color: Colors.green, alphaColor: Colors.greenAlpha },
    { route: 'MyOffers', label: lang.myOffersTab, type: Icons.Ionicons, icon: 'easel-outline', component: MyOffers, color: Colors.purple, alphaColor: Colors.purpleAlpha },
    { route: 'MyAccount', label: lang.myAccountTab, type: Icons.Ionicons, icon: 'person-outline', component: MyAccount, color: Colors.red, alphaColor: Colors.redAlpha },

  ]

  useEffect(()=>{
    console.log(distance)
  },[])

  const MINUTE_MS = 60000;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     Notifications.presentNotificationAsync({
  //       title: 'Look at that notification',
  //       body: "I'm so proud of myself!",
  //     });
  //     console.log(new Date().toISOString());
  //   }, MINUTE_MS);
  
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, [])


  const checkForNewOffers = async() => {
    // const response = 
  }

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      retriveUserJobs();
      retriveUserOffers();
    })
    return () => {
      unsubscribe();
    }
  }, [navigation])


  const retriveUserJobs = async() => {
    const response = await getUserJobs(uid);
    let jobs = response.data;
    jobs = jobs.map(o => {
      let tempDate = o.serviceDate.split("T")[0];
      o.serviceDate = tempDate;
      return o
    })
    dispatch(userJobs(jobs));
  }

  const retriveUserOffers = async() => {
    const response = await getUserOffers(uid);
    let offers = response.offers.data;
    offers = offers.map(o => {
      let tempDate = o.serviceDate.split("T")[0];
      o.serviceDate = tempDate;
      return o
    })
    dispatch(userOffers(offers))
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