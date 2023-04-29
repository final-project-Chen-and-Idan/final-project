import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native'
// import { messaging } from '../../firebase'
import React, { useEffect } from 'react'

const SendNotification = () => {

  const getPermission = async()=> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    else
      console.log("else")
  }
    // useEffect(()=>{
    //     // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    //     getPermission()
    // },[])


    return (
    <View>
      <TouchableOpacity onPress={getPermission}>
        <Text>click here</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SendNotification

const styles = StyleSheet.create({})