import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity} from "react-native";
import { Image } from "react-native";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { fb } from "../../firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { OpenMapDirections } from 'react-native-navigation-directions';
const check = require("../img/check.png");
function BookingsScreen({ route, navigation }) {
  const [myBookings, setMyBookings] = useState([]);
  const [booking, setBooking] = useState({});
  const [hasBooking, setHasBooking] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
  const [isDrop, setIsDrop] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection("bookings")
      .where("status", "==", 5)
      .where("isRemitted", "==", false)
      .where("driverId", "==", fb.auth().currentUser.uid)
      /* .orderBy("createdAt") */
      .onSnapshot((querySnapshot) => {
        const bookingsArray = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setMyBookings(bookingsArray);
        console.log(bookingsArray);
      });
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("drivers")
      .doc(fb.auth().currentUser.uid)
      .collection("bookings_dispatch")
      .where("isAccepted", "==", false)
      .where("status", "==", 1)
      /* .orderBy("createdAt") */
      .onSnapshot((querySnapshot) => {
        querySnapshot.docs.map((documentSnapshot) => {
          if (documentSnapshot.data().status === 1) {
            setBooking({
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            });
            setHasBooking(true);
          }
        });
      });
  }, []);

  useEffect(() => {
    if(hasBooking) {
        setTimeout(() => {
            setHasBooking(false);
        }, 10000);
    }
  }, [hasBooking])

  const acceptDispatch = () => {
    setIsPickup(true)
    var date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    setHasBooking(false);
    var bookingRef = firebase.firestore().collection("bookings").doc(booking.bookingId)
    bookingRef .update({
        hasRider: true,
        isAccepted: true,
        status: 3
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    firebase.firestore().collection("bookings").doc(booking.bookingId).collection("timeline").add({
        time: strTime,
        title: "Accepted", 
        description: "Your driver is on his way",
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        step: 2
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
    // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    firebase
    .firestore()
    .collection("drivers")
    .doc(fb.auth().currentUser.uid)
    .collection("bookings_dispatch")
    .doc(booking.id)
    /* .orderBy("createdAt") */
    .update({
        isAccepted: true,
    });
    
    _callShowDirections(booking.origin.latitude, booking.origin.longitude)
  }

  const _callShowDirections = (toLat, toLong) => {
        const startPoint = {
        
        } 

        const endPoint = {
            longitude: toLong,
            latitude: toLat
        }

        const transportPlan = 'd';

        OpenMapDirections(startPoint, endPoint, transportPlan).then(res => {
            console.log(res)
        });
    }

  const pickup = () => {
    setIsPickup(false)
    setIsDrop(true)
    var date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    setHasBooking(false);
    var bookingRef = firebase.firestore().collection("bookings").doc(booking.bookingId)
    bookingRef .update({
        status: 4
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    firebase.firestore().collection("bookings").doc(booking.bookingId).collection("timeline").add({
        time: strTime,
        title: "Arrived Origin", 
        description: "Your driver is now on your origin",
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        step: 3
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
    // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    _callShowDirections(booking.destination.latitude, booking.destination.longitude)
  }

  const dropOff = () => {
    setIsDrop(false)
    var date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    setHasBooking(false);
    var bookingRef = firebase.firestore().collection("bookings").doc(booking.bookingId)
    bookingRef .update({
        status: 5
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    firebase.firestore().collection("drivers").doc(fb.auth().currentUser.uid).update({
        status: 1
    })

    firebase.firestore().collection("bookings").doc(booking.bookingId).collection("timeline").add({
        time: strTime,
        title: "Ariived Destination", 
        description: "You're arrive at your destination",
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        step: 4
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
    // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  const remitMyBookings = () => {
    var feeArray = []
    if(myBookings.length > 0) {
        myBookings.map(booking => {
            feeArray.push(booking.fare)

            firebase.firestore().collection("bookings")
            .doc(booking.id)
            .update({
                isRemitted: true
            })
        }),
        firebase.firestore().collection("remits")
        .add({
            driverComission: feeArray.reduce((a, b) => a + b, 0) * 0.20,
            driverId: fb.auth().currentUser.uid,
            driverName: fb.auth().currentUser.displayName,
            etulodPercentage: 20,
            isPaid: false,
            remitFee: feeArray.reduce((a, b) => a + b, 0),
            remittedAt: firebase.firestore.Timestamp.fromDate(new Date()),
            tripCtr: myBookings.length,
          })
          .then((docRef) => {
            Alert.alert("Remitted Successfully!")
            setMyBookings([])
          });
    } else {
        Alert.alert("You don't have bookings to remit!")
    }
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            marginBottom: 20,
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>My Bookings</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Remits')}
          >
            <Text style={{fontSize: 17, fontWeight: 'bold', color: '#05686e'}}>Remits</Text>
          </TouchableOpacity>
        </View>
        {myBookings.length > 0 ? (
          myBookings.map((mybookings, index) => (
            <View key={index} style={styles.myBookingsBox}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                    Passenger:{" "}
                  </Text>
                  {mybookings.passengerName}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                    Fare:{" "}
                  </Text>
                  {mybookings.fare}
                </Text>
              </View>
              <Text style={{ fontWeight: "bold" }}>
                <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                  Origin:{" "}
                </Text>
                [{mybookings.origin.latitude},{mybookings.origin.longitude}]
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                  Destination:{" "}
                </Text>
                [{mybookings.destination.latitude},
                {mybookings.destination.longitude}]
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                  Distance:{" "}
                </Text>
                {mybookings.distance.toFixed(2)} km
              </Text>
            </View>
          ))
        ) : (
          <Text>No Bookings to display</Text>
        )}
        <Button
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 18 }}
          style={styles.appButtonContainer}
          mode="contained"
          onPress={remitMyBookings}
        >
          Remit
        </Button>
      </ScrollView>
      <FancyAlert
        visible={hasBooking}
        icon={
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 50,
              width: "100%",
            }}
          >
            <Image
              source={check}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          </View>
        }
        style={{ backgroundColor: "white" }}
      >
        <Text
          style={{
            marginTop: -16,
            marginBottom: 5,
            fontSize: 14,
            fontWeight: "bold",
            color: "green",
          }}
        >
          You have a trip request. Hurry up!
        </Text>
        <Button
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 18 }}
            style={{
              elevation: 4,
              marginTop: 10,
              backgroundColor: "#05686e",
              borderRadius: 25,
              width: "90%",
              height: 50,
              marginBottom: 14,
              fontSize: 25,
            }}
            mode="contained"
            onPress={acceptDispatch}
          >
            Accept
          </Button>
      </FancyAlert>

      <FancyAlert
        visible={isPickup}
        icon={
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 50,
              width: "100%",
            }}
          >
            <Image
              source={check}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          </View>
        }
        style={{ backgroundColor: "white" }}
      >
        <Text
          style={{
            marginTop: -16,
            marginBottom: 5,
            fontSize: 14,
            fontWeight: "bold",
            color: "green",
          }}
        >
          Continue when your arrive at passenger origin
        </Text>
        <Button
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 18 }}
            style={{
              elevation: 4,
              marginTop: 10,
              backgroundColor: "#05686e",
              borderRadius: 25,
              width: "90%",
              height: 50,
              marginBottom: 14,
              fontSize: 25,
            }}
            mode="contained"
            onPress={pickup}
          >
            Pick Up
          </Button>
      </FancyAlert>

      <FancyAlert
        visible={isDrop}
        icon={
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 50,
              width: "100%",
            }}
          >
            <Image
              source={check}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          </View>
        }
        style={{ backgroundColor: "white" }}
      >
        <Text
          style={{
            marginTop: -16,
            marginBottom: 5,
            fontSize: 14,
            fontWeight: "bold",
            color: "green",
          }}
        >
          Continue when you drop off you passenger
        </Text>
        <Button
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 18 }}
            style={{
              elevation: 4,
              marginTop: 10,
              backgroundColor: "#05686e",
              borderRadius: 25,
              width: "90%",
              height: 50,
              marginBottom: 14,
              fontSize: 25,
            }}
            mode="contained"
            onPress={dropOff}
          >
            Drop Off
          </Button>
      </FancyAlert>
    </>
  );
}

export default BookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    /* justifyContent: 'center',
        alignItems: 'center' */
  },
  myBookingsBox: {
    borderRadius: 15,
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
  },
  appButtonContainer: {
    elevation: 4,
    marginTop: 15,
    backgroundColor: "#05686e",
    borderRadius: 25,
    width: "100%",
    height: 50,
    marginBottom: 14,
    fontSize: 25,
  },
});
