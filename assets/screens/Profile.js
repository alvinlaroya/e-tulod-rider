import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions} from 'react-native';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Avatar, IconButton, Switch} from 'react-native-paper';
import { fb } from '../../firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

function ProfileScreen({navigation}) {
    const [session, setSession] = useState({})
    const [isOnline, setIsOnline] = useState(false)
    
    useEffect(() => {
        var sessionRef = firebase.firestore().collection("drivers").doc(fb.auth().currentUser.uid);

        sessionRef.get().then((doc) => {
            if (doc.exists) {
                setSession(doc.data())
                setIsOnline(doc.data().isOnline)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, [])

    const onToggleSwitch = () => {
        setIsOnline(!isOnline);
        var driverRef = firebase.firestore().collection("drivers").doc(fb.auth().currentUser.uid);

        // Set the "capital" field of the city 'DC'
        return driverRef.update({
            isOnline: !isOnline,
            status: !isOnline ? 1 : 0
        })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    const signOut = () => {
        /* Speech.speak("Thank your for using fire safety inspection certificate online application. See you again soon"); */
        try {
          firebase.auth().signOut();
          navigation.navigate("SplashScreen");
        } catch (error) {
          console.log(error);
        }
      };

    const myStatus = (status) => {
        var text = "";
        switch(status){
            case 0:
                text = "Offline"
                break;
            case 1:
                text = "Available"
                break;
            case 2:
                text = "On Pickup Passenger / OTW"
                break;
            case 2:
                text = "Picked up Passenger"
                break;
            case 2:
                text = "Arrived at Destination"
                break;
            default:
                text = ""
        }

        return text;
    }
    return(
        <View style={styles.container}>
            <View
                style={{
                    position: 'absolute',
                    top: 40, left: 20,
                    flexDirection: 'row',
                    width: 200, height: 50
                }}
            >
                <Switch value={isOnline} onValueChange={onToggleSwitch} />
                <Text style={{marginTop: 17, fontWeight: 'bold'}}>{isOnline ? "Online" : "Offline"}</Text>
            </View>
            <IconButton
              icon="logout"
              color="#05686e"
              size={30}
              onPress={signOut}
              style={{
                  position: 'absolute',
                  top: 35, right: 10
              }}
            />
            <Avatar.Image size={140} source={{
                uri: session.profile
            }} />
            <Text style={{fontSize: 22, fontWeight: 'bold', marginTop: 10}}>{`${session.fname} ${session.mname} ${session.lname}`}</Text>
            <Text style={{fontSize: 13, fontWeight: 'bold', marginTop: 2}}>{session.email}</Text>
            <View style={{flexDirection: 'row', width: '100%', padding: 20, marginTop: 30}}>
                <View style={{flexDirection: 'row', width: '50%'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Address: </Text>
                    <Text style={{fontSize: 15}}>{session.address}</Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Contact: </Text>
                    <Text style={{fontSize: 15}}>{session.contact}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', width: '100%', padding: 20, marginTop: -30}}>
                <View style={{flexDirection: 'row', width: '50%'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Rate: </Text>
                    <Text style={{fontSize: 15}}>{session.rate}</Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Status: </Text>
                    <Text style={{fontSize: 15}}>{myStatus(session.status)}</Text>
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Driver License Photo: </Text>
                <Image
                    source={{
                        uri: session.driverLicense
                    }}
                    style={{marginTop: 14, borderWidth: 2, borderColor: 'black', borderRadius: 5, height: 200, width: Dimensions.get("window").width - 50}}
                ></Image>
            </View>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});