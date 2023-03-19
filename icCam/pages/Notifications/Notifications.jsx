import { StyleSheet, Text, TouchableOpacity, View, Button, Platform } from 'react-native'
import { useState, useEffect, useRef } from 'react';
// import * as Device from 'expo-device';
// import * as notification from 'expo-notifications';

const MyNotifications = () => {
 
  return (
    <View>
     <TouchableOpacity style = {styles.button}>
                  <Text style={styles.buttonText}>Press to Send Notification</Text>
                  </TouchableOpacity>
    </View>
  );
}
export default MyNotifications

const styles = StyleSheet.create({

  button: {
    borderWidth: 2,
    alignSelf: 'center',
    width: '40%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'oldlace',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    backgroundColor: `#daa520`,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
})