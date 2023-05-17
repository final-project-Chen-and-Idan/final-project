import { StyleSheet, PermissionsAndroid, Alert, TouchableOpacity, Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import messaging from '@react-native-firebase/messaging'
import {auth, db} from '../../firebase'
import { updateDoc, collection, query , where, getDocs } from 'firebase/firestore'

  const SendNotification = () => {
    
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    
    // uploads the current notification token to the firebase
    const uploadToken = async()=>{
      // getting the token
      const token = await messaging().getToken();

      // getting the current user 
      const q = query(collection(db, "Users"), where("id", "==", auth.currentUser.uid));
      const gottenDocs = await getDocs(q);
      
      // uploading the token to firestore
      gottenDocs.docs.forEach(async(doc)=>{
        await updateDoc(doc.ref, {token: token});
      })

    }

    useEffect(()=>{
      uploadToken();
    })

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
      });
  
      return unsubscribe;
    }, []);

    return (
      <>
      </>
    )
}

export default SendNotification

const styles = StyleSheet.create({})