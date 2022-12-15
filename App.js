import { Provider } from 'react-redux';
import HomeScreen from './src/Screens/HomeScreen';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import UserDataScreen from './src/Screens/UserDataScreen';
import LoadingScreen from './src/Screens/LoadingScreen';



LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
const Stack = createNativeStackNavigator();

const options = {
  headerShown: false,
}


export default function App() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" options={options} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={options} component={LoginScreen} />
          <Stack.Screen name="Home" options={options} component={HomeScreen} />
          <Stack.Screen name="Register" options={options} component={RegisterScreen} />
          <Stack.Screen name="UserData" options={options} component={UserDataScreen} />
          <Stack.Screen name="Loading" options={options} component={LoadingScreen}/>

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}