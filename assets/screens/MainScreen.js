import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  Text,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ImageBackground, Image, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Timeline from "react-native-timeline-flatlist";
import {
  Appbar,
  Avatar,
  IconButton,
  Button,
  TextInput,
  Divider,
  Chip,
} from "react-native-paper";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fb } from '../../firebase';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
/* const loadingIcon = require("../loadingicon.gif");
const check = require("../img/check.png");
const driver_search = require("../img/find.png"); */

const MainScreen = ({ route, navigation }) => {
    const [session, setSession] = useState({})
  /* const { userId, fname, lname, email, contact, address, profile, type } = route.params; */
  const [location, setLocation] = useState({
    latitude: 16.322825415621658,
    longitude: 120.36770346587748,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location1 = await Location.getCurrentPositionAsync({});
      setLocation((prevState) => ({
        ...prevState,
        latitude: location1.coords.latitude,
        longitude: location1.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }));

      firebase.firestore().collection("drivers")
      .doc(fb.auth().currentUser.uid)
      .update({
        coordinates: new firebase.firestore.GeoPoint(
          location.latitude,
          location.longitude
        ),
      })
    })();
  }, []);

  useEffect(() => {
    var sessionRef = firebase.firestore().collection("drivers").doc(fb.auth().currentUser.uid);

    sessionRef.get().then((doc) => {
        if (doc.exists) {
            setSession(doc.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}, [])

  useEffect(() => {
    firebase
      .firestore()
      .collection("bookings")
      .where("status", "==", 1)
      /* .orderBy("createdAt") */
      .onSnapshot((querySnapshot) => {
        const bookingsArray = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setBookings(bookingsArray);
      });
  }, []);
  
  const signOut = () => {
    /* Speech.speak("Thank your for using fire safety inspection certificate online application. See you again soon"); */
    try {
      firebase.auth().signOut();
      navigation.navigate("SplashScreen");
    } catch (error) {
      console.log(error);
    }
  };

  return (
   <View style={styles.container}>
        <MapView
      style={styles.map}
      region={
        location.latitude !== null && location.longitude !== null
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          : location
      }
      showsUserLocation={true}
      showsBuildings={true}
      showsTraffic={true}
      showsIndoors={true}
      rotateEnabled={true}
      loadingEnabled={true}
      showsMyLocationButton={false}
      showsCompass={true}
    >
      {bookings.length > 0 &&
        bookings.map((location, index) => (
          <Marker
            key={index}
            draggable
            coordinate={{
              latitude: location.origin.latitude,
              longitude: location.origin.longitude,
            }}
            title="Booked a trip"
            description={`${location.passengerName}`}
          />
        ))}
    </MapView>
    <View
    style={{
      padding: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      position: "absolute",
      top: 15,
      left: 0,
    }}
  >
    <View style={{ width: "75%" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5 }}>
        {session.fname} {session.lname}
      </Text>
      <Text style={{ fontSize: 12, marginTop: 1 }}>{session.email}</Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "25%",
      }}
    >
      <Avatar.Image
        size={44}
        style={{ marginRight: 10 }}
        source={{
          uri:
            session?.profile !== ""
              ? session.profile
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
        }}
      />
      <View
        style={{
          height: 45,
          width: 45,
          backgroundColor: "white",
          alignItems: "center",
          alignContent: "center",
          borderRadius: 50,
        }}
      >
        <IconButton
          icon="logout"
          color="#05686e"
          size={30}
          onPress={signOut}
          style={{ marginTop: -1, marginLeft: 10 }}
        />
      </View>
    </View>
  </View>
   </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  appButtonContainer: {
    elevation: 4,
    marginTop: 15,
    backgroundColor: "#05686e",
    borderRadius: 25,
    width: "90%",
    height: 50,
    marginBottom: 14,
    fontSize: 25,
    position: "absolute",
    bottom: 30,
  },
});
