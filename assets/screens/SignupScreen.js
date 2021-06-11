import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
/* import { firebase } from '../../firebase'; */
import { Appbar, Button, TextInput } from "react-native-paper";
/* import "firebase/auth"; */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* var background = require('./assets/citybackground.jpg'); */
import firebase from "firebase/app";
import { fb } from "../../firebase";

const loadingIcon = require('../loadingicon.gif');

const SignUpScreen = ({ route, navigation }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [image, setImage] = useState("");
  const [licenseImage, setLicenseImage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [license, setLicense] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);


  const signupUser = async (fnameVal, mnameVal, lnameVal, addressVal, emailVal, contactVal, passwordVal) => {
    setIsSigningUp(true);
    try {
      if(fnameVal === "" && mnameVal === "" && lnameVal === "" && addressVal === "" && emailVal === "" && passwordVal === "") {
        alert("Please fill all the fields!")
        setIsSigningUp(false);
        return;
      } else {
        fb.auth().createUserWithEmailAndPassword(emailVal, passwordVal).then(async (cred) => { 
          let driverRef = firebase.firestore().collection("drivers").doc(cred.user.uid);
          const timestamp = firebase.firestore.FieldValue.serverTimestamp;

          driverRef.set({
              id: cred.user.uid,
              fname: fnameVal,
              mname: mnameVal,
              lname: lnameVal,
              address: addressVal,
              profile: profileImage,
              email: emailVal,
              contact: contactVal,
              accepted: false,
              coordinates: null,
              declined: false,
              driverLicense: license,
              hasDriverLicense: hasLicense,
              isOnline: true,
              onlinedAt: null,
              rate: 0,
              status: 0,
              createdAt: timestamp()
          }).then(() => {
            /* fb.auth().signOut().then(() => {
              // Sign-out successful.
            }).catch((error) => {
              // An error happened.
            }); */
          })
          
          if(cred.user){
            cred.user.updateProfile({
              displayName: `${fname} ${lname}`,
              photoURL: profileImage
            }).then((s)=> {
              console.log(s)
              setIsSigningUp(false);
            })

            navigation.navigate("SplashScreen")
          }

        }).catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          Alert.alert(
            "e-tulod",
            `${errorMessage}`,
            [
                {
                text: "Close",
                onPress: () => console.log("Close Pressed"),
                style: "cancel"
                },
            ],
            { cancelable: false }
        );
          // ...
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = fb
      .storage()
      .ref()
      .child("profileImages/" + imageName);

    ref.put(blob).on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error.message);
      },
      () => {
        ref.getDownloadURL().then((url) => {
          //from url you can fetched the uploaded image easily
          setProfileImage(url);
        });
      }
    );
  };

  const uploadImageLicense = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = fb
      .storage()
      .ref()
      .child("licenseImage/" + imageName);

    ref.put(blob).on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error.message);
      },
      () => {
        ref.getDownloadURL().then((url) => {
          //from url you can fetched the uploaded image easily
          setLicense(url);
          setHasLicense(true)
        });
      }
    );
  };

  const pickImage = async () => {
    /* let result = await ImagePicker.launchCameraAsync(); */ // THIS IS FOR TRIGGERING CAMERA
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      var date = Math.round(new Date().getTime() / 1000);
      uploadImage(result.uri, `etulodProfiles${date}`)
        .then(() => {
          //
        })
        .catch((error) => {
          alert(error);
        });

      setImage(result.uri);
    }
  };

  const pickImageLicense = async () => {
    /* let result = await ImagePicker.launchCameraAsync(); */ // THIS IS FOR TRIGGERING CAMERA
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      var date = Math.round(new Date().getTime() / 1000);
      uploadImageLicense(result.uri, `driversLicenseImage${date}`)
        .then(() => {
          //
        })
        .catch((error) => {
          alert(error);
        });

      setLicenseImage(result.uri);
    }
  };

  return isSigningUp ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{
          uri: "https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif",
        }}
        style={{ width: "70%", height: 70 }}
      />
      <Text style={{ fontSize: 12, fontWeight: "bold", marginTop: -15 }}>
        Signing Up
      </Text>
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" barStyle="dark-content" />
      <Appbar style={styles.bottom}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => navigation.navigate("SplashScreen")}
          color="black"
          style={{ marginTop: 20, marginLeft: -10 }}
        />
      </Appbar>
      <View style={styles.formContainer}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 15,
            color: "#05686e",
            textAlign: "center",
          }}
        >
         e-tulod Poblacion Norte Caba, La Union
        </Text>
        <View>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri:
                  image !== ""
                    ? image
                    : "https://icon-library.com/images/upload-picture-icon/upload-picture-icon-27.jpg",
              }}
              style={styles.logoProfile}
            ></Image>
          </TouchableOpacity>
          <Text
            style={{ textAlign: "center", marginTop: -15, marginBottom: 15 }}
          >
            {image !== "" ? "Change Profile Picture" : "Select Profile Picture"}
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            dense={true}
            label="First Name"
            onChangeText={(fname) => setFname(fname)}
          />
          <TextInput
            dense={true}
            label="Middle Name"
            onChangeText={(mname) => setMname(mname)}
            style={{marginTop: 10}}
          />
          <TextInput
            dense={true}
            label="Last Name"
            onChangeText={(lname) => setLname(lname)}
            style={{marginTop: 10}}
          />
          <TextInput
            dense={true}
            label="Address"
            onChangeText={(address) => setAddress(address)}
            style={{marginTop: 10}}
          />
          <TextInput
            dense={true}
            label="Contact"
            onChangeText={(contact) => setContact(contact)}
            style={{marginTop: 10}}
            maxLength={11}
            keyboardType='numeric'
          />
          <TextInput
            dense={true}
            label="Email"
            onChangeText={(email) => setEmail(email)}
            style={{marginTop: 10}}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "100%" }}>
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Password"
                secureTextEntry={!passwordVisible}
                onChangeText={(password) => setPassword(password)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ position: "absolute", top: 12, right: 4 }}
              >
                <MaterialCommunityIcons
                  name={passwordVisible ? `eye-off-outline` : `eye-outline`}
                  color="black"
                  size={25}
                  style={styles.iconInput}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{width: '100%'}}>
          <TouchableOpacity onPress={pickImageLicense}>
            <Image
              source={{
                uri:
                  licenseImage !== ""
                    ? licenseImage
                    : "https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/gallery/philippine-drivers-license-5fc9f1eb3b9f9.jpg",
              }}
              style={{
                  height: 180, width: '100%', marginBottom: 20, marginTop: 15
              }}
            ></Image>
            <Text
                style={{ textAlign: "center", marginTop: -15, marginBottom: 15, fontWeight: 'bold' }}
            >
            Upload Driver License Photo
            </Text>
          </TouchableOpacity>
        </View>
        {license !== "" && profileImage !== "" ? (
            <Button
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 18 }}
                style={styles.appButtonContainer}
                loading={buttonLoading == true ? true : false}
                mode="contained"
                onPress={() =>
                signupUser(
                    fname,
                    mname,
                    lname,
                    address,
                    email,
                    contact,
                    password
                )
                }
            >
                SIGN UP
            </Button>
        ) : (
            <>
                {image !== "" && licenseImage !== "" ? (
                    <Image
                        source={loadingIcon}
                        style={{height: 70, width: 100}}
                    ></Image>
                ) : (
                    <View style={{
                        backgroundColor: 'red',
                        width: '100%',
                        height: 40, padding: 10, alignContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{color: 'white'}}>Please upload profile and license photo</Text>
                    </View>
                )}
            </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("SigninScreen")}
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          <Text style={styles.appButtonTextSignUp}>
            Have already an account?{" "}
            <Text style={{ color: "#c90632" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoProfile: {
    width: 145,
    height: 145,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 15,
  },
  title: {
    color: "black",
    marginBottom: 0,
    fontSize: 15,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  usernameInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  passwordInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  iconInput: {
    padding: 10,
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
  appButtonTextSignUp: {
    fontSize: 14,
    color: "black",
    alignSelf: "center",
  },
  bottom: {
    backgroundColor: "white",
    elevation: 0,
  },
});
