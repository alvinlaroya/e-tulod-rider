import React, { Component } from 'react';
import { View, StyleSheet, Text  } from 'react-native';
import { ImageBackground, Image } from 'react-native';
import { Appbar } from 'react-native-paper';

class NotAcceptedScreen extends Component {
    render(){
        return(
            <>
            <Appbar style={styles.bottom}>
                <Appbar.Action
                    icon="arrow-left"
                    onPress={() => this.props.navigation.navigate('SplashScreen') }
                    color="black"
                />
            </Appbar>
                <View style={styles.container}>
                    <Image 
                        source={{ uri: 'https://icons-for-free.com/iconfiles/png/512/avatar+user+account+confirm+approve+complete-1320567854562615796.png' }}
                        style={{width: '60%', height: 150 }}
                    />
                    <Text style={styles.ops}>Oppss!</Text>
                    <View style={{ padding: 30, marginTop: -20}}>
                        <Text>
                            <Text style={styles.opsDesc}>Your account has not yet been approved. Please wait for your account confirmation </Text>
                            <Text style={styles.link} onPress={() => alert(1) }>
                                Learn more.
                            </Text>
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

export default NotAcceptedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottom: {
        backgroundColor: 'white',
        elevation: 0
    },
    ops:{
        fontWeight: 'bold',
        fontSize: 22
    },
    opsDesc:{
        fontSize: 14
    },
    link:{
        fontSize: 14,
        color: '#c90632'
    }
});