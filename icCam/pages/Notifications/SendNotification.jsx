import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity , Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import messaging from '@react-native-firebase/messaging'

  const SendNotification = () => {
    
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });
  
      return unsubscribe;
    }, []);

    return (
    <View>
      <TouchableOpacity>
        <Text>click here</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SendNotification

const styles = StyleSheet.create({})