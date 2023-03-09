//import { createStackNavigator } from 'react-navigation-stack';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Linking } from 'react-native';
import LoginNavigation from './pages/Login/LoginNavigation';

export default function App() {

  

  return (
    
    // <View style={styles.container}>
    //   <Text style={styles.Text}>IC-CAM</Text>
    //   <StatusBar style="auto" />
    //   <View style={styles.buttonView}>
    //       <TouchableOpacity style={styles.button} onPress={()=>Linking.openURL("https://youtu.be/qLMmw8YXzKY")}>
    //         <Text style={styles.textButton}></Text>
    //       </TouchableOpacity>
          
    //     </View>
      
      
    // </View>
    <LoginNavigation/>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131a47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    //fontFamily: 'David',

    fontSize: 70,
    color: 'gold',
    fontWeight: "6",
  },
  buttonView: {
    //backgroundColor: 'white',
    width: '100%',
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    width: 200,
    height: 60,
    //backgroundColor: "rgba(0, 0, 0, 0.9)",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: 20,
    color:"white",
    borderWidth: 0.5,
    borderColor: "white",
    marginTop: 20
},
});
