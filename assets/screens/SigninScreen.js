import React, { Component, useState }from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { fb } from '../../firebase';
import { Button } from 'react-native-paper';
import "firebase/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* var background = require('./assets/citybackground.jpg'); */
var logo = require('../img/etulodlogo.png');

const SignInScreen = ({props, navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);


    const signinUser = (emailVal, passwordVal) => {
        setButtonLoading(true);
        try {
            fb.auth().signInWithEmailAndPassword(emailVal, passwordVal).then(() => {
            navigation.navigate("WelcomeBeforeLogin")
          }).catch(function(signInError){
            Alert.alert(
              'SFIS',
              `${signInError.toString()}`,
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
              ],
              { cancelable: false }
            );
          })
        } catch (error) {
          console.log(error)
        }
      }

    return (
        <View style={styles.container}>
          <StatusBar style="dark" barStyle="dark-content" StatusBarAnimation="slide" />
          <View style={styles.formContainer}>
              <Image source={logo} style={styles.logo}></Image>
              <Text style={styles.title}>e-tulod RIder</Text>
              <Text style={{fontSize: 11, marginBottom: 15, color: 'black', textAlign: 'center'}}>
                  Poblacion Norte Caba, La Union
              </Text>
              <View style={styles.SectionStyle}>
                <MaterialCommunityIcons name="email-outline" color="black" size={25} style={styles.iconInput} />
                <TextInput
                  style={styles.usernameInput}
                  onChangeText={(email) => setEmail(email)}
              /*  value={emailValue} */
                  placeholder={'Place your Email'}
                />
              </View>

              <View style={styles.SectionStyle}>
                <MaterialCommunityIcons name="lock-outline" color="black" size={25} style={styles.iconInput} />
                <TextInput
                    style={styles.passwordInput}
                    onChangeText={(password) => setPassword(password)}
                  /*  value={passwordValue} */
                    secureTextEntry={!passwordVisible}
                    placeholder={'Place your Password'}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <MaterialCommunityIcons name={passwordVisible ? `eye-off-outline` : `eye-outline`} color="black" size={25} style={styles.iconInput} />
                </TouchableOpacity>
              </View>
              <Button 
                contentStyle={{height: 50}}
                labelStyle={{fontSize: 18}}
                style={styles.appButtonContainer} 
                loading={buttonLoading == true ? true : false} 
                mode="contained" 
                onPress={() => signinUser(email, password)}
              >
                  LOGIN
              </Button>
              <TouchableOpacity 
                  onPress={() => navigation.navigate('SignupScreen') }
              >
              <Text style={styles.appButtonTextSignUp}>Don't have an account? <Text style={{color: '#c90632'}}>Sign Up</Text></Text>
              </TouchableOpacity>
          </View>
        </View>
    );
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
      borderRadius: 20
    },
    title: {
      color: 'black',
      marginBottom: 0,
      fontSize: 15,
      fontWeight: 'bold'
    },
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15
    },
    usernameInput: {
      fontSize: 15,
      flex: 1,
      borderRadius: 25,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
    },
    passwordInput: {
      fontSize: 15,
      flex: 1,
      borderRadius: 25,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
    },
    SectionStyle: {
      elevation: 2,
      borderRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginBottom: 10
    },    
    iconInput: {
      padding: 10
    },
    appButtonContainer: {
      elevation: 4,
      backgroundColor: "#05686e",
      borderRadius: 25,
      width: '100%',
      height: 50,
      marginBottom: 14,
      fontSize: 25
    },
    appButtonTextSignUp: {
      fontSize: 14,
      color: "black",
      alignSelf: "center",
    }
});