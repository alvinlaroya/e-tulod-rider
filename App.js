
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Text, View, Linking} from 'react-native';
import { Button, Snackbar, Avatar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { BaseNavigationContainer, NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
LogBox.ignoreLogs(['Setting a timer']);
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

// Imported Screens
import SplashScreen from './assets/screens/SplashScreen';
import WelcomeBeforeLogin from './assets/screens/WelcomeBeforeLogin'
import SigninScreen from './assets/screens/SigninScreen'
import SignupScreen from './assets/screens/SignupScreen'
import MainScreen from './assets/screens/MainScreen'
import NotAcceptedScreen from './assets/screens/NotAcceptedScreen'
import Profile from './assets/screens/Profile'
import Bookings from './assets/screens/Bookings'
import Remits from './assets/screens/Remits'

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

const App = () => {
  const [notification, setNotification] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log(notification)
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  },[]);

  function MyTabs() {
    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let isProfile = false;
          if (route.name === 'Maps') {
            iconName = focused
              ? 'map-marker'
              : 'map-marker-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'format-list-bulleted-square' : 'format-list-bulleted';
          } else if (route.name === 'Profile') {
            isProfile = true
            iconName = focused ? 'format-list-bulleted-square' : 'format-list-bulleted';
          }

          // You can return any component that you like here!
          return isProfile ? (
            <Avatar.Image size={24} source={{uri: 'https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png'}} />
          ) : (
            <MaterialCommunityIcons name={iconName} color={color} size={size} style={styles.iconInput}/>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      >
        <Tab.Screen name="Maps" component={MainScreen} />
        <Tab.Screen name="Bookings" component={Bookings} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" animation="spring">
          {/* <Stack.Screen name="SpashScreen" component={SplashScreen} options={{ headerShown: false, cardStyleInterpolator: forFade }}/> */}
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="WelcomeBeforeLogin" component={WelcomeBeforeLogin} options={{ headerShown: false }}/>
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="NotAcceptedScreen" component={NotAcceptedScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name="MainScreen" component={MyTabs} options={{ headerShown: false }}/>
          <Stack.Screen name="Remits" component={Remits} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

