import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fb } from "../../firebase";
import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';

function RemitScreen({route, navigation}) {
    const [myRemits, setMyRemits] = useState([]);

    useEffect(() => {
        firebase
          .firestore()
          .collection("remits")
          .where("isPaid", "==", true)
          .where("driverId", "==", fb.auth().currentUser.uid)
          /* .orderBy("createdAt") */
          .onSnapshot((querySnapshot) => {
            const bookingsArray = querySnapshot.docs.map((documentSnapshot) => {
              return {
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              };
            });
    
            setMyRemits(bookingsArray);
            console.log(bookingsArray);
          });
      }, []);

    return(
        <ScrollView style={styles.container}>
        <View
          style={{
            marginBottom: 20,
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Bookings')}
          >
            <Text style={{fontSize: 17, fontWeight: 'bold', color: '#05686e'}}>Back</Text>
          </TouchableOpacity>
        </View>
        {myRemits.length > 0 ? (
          myRemits.map((remit, index) => (
            <View key={index} style={styles.myBookingsBox}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                    Driver Comission:{" "}
                  </Text>
                  ₱{remit.driverComission}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold", color: "#05686e" }}>
                    Fare:{" "}
                  </Text>
                  ₱{remit.remitFee}
                </Text>
              </View>
              <View>
                  <Text>{`${moment.unix(remit.remittedAt.seconds).format("DD MMM YYYY")}`}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No Bookings to display</Text>
        )}
      </ScrollView>
    )
}

export default RemitScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#f2f2f2',
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
});