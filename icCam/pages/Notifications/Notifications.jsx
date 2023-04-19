import { StyleSheet, Text, TouchableOpacity, View, Button, Platform } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import registerNNPushToken from 'native-notify';
// import * as Device from 'expo-device';
// import * as notification from 'expo-notifications';
// import React, { useState, useEffect } from 'react';
import { getPushDataObject } from 'native-notify';
import { Notifications } from 'expo';
import PushNotification from 'react-native-push-notification';
// import AlarmClock from 'react-native-alarm-clock';
import Alarm from 'react-native-alarm';
// import Alarm from 'react-native-alarm';
import Sound from 'react-native-sound';
import { Audio } from 'expo-av';


const MyNotifications = () => {


  // const setAlarm = () => {
  //   AlarmClock.createAlarm({
  //     hour: 6,
  //     minute: 30,
  //     message: 'Wake up!',
  //   });
  // };



//   registerNNPushToken(6828, 'ZbDvAG9OgKWW3jVtqio59y');

//   let pushDataObject = getPushDataObject();

//   useEffect(() => {
//     console.log(pushDataObject);
// }, [pushDataObject]);

const sendNotification = async () => {
  // PushNotification.localNotification({
  //   title: "title",
  //   message: "remoteMessage.notification.body",
  //   //ios and android properties
  //   playSound: true,
  //   soundName: 'sound.mp3',
  //   //android only properties
  //   channelId: 'your-channel-id',
  //   autoCancel: true,
  //   bigText: 'Face2Face: Beacon Timer Expired',
  //   subText: 'Perhaps set your beacon timer for another hour?',
  //   vibrate: true,
  //   vibration: 300,
  //   priority: 'high',
  // })
//   const content = {
//     title: 'Notification Title',
//     body: 'Notification body text',
//     data: { data: 'goes here' },
//   };
//   const trigger = { seconds: 2 };
//   await Notifications.scheduleNotificationAsync({ content, trigger });
};
const triggerAlarm = () => { 
  // Alarm.createAlarm({
  //   startAt: new Date(Date.now() + 10000), // Alarm will trigger 10 seconds from now
  //   message: 'Alarm!',
  //   soundName: 'default',
  //   interval: 'daily',
  // });
};

// const playSound = () => {
//   const soundPath = '../../assets/alarm.wav'; 
//   const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('failed to load the sound', error);
//       return;
//     }
//     sound.play(() => {
//       sound.release();
//     });
//   });
// };


  return (
    <View>
      {/* <Button title="Set Alarm" onPress={setAlarm} /> */}
     {/* <TouchableOpacity style = {styles.button}>
        <Text style={styles.buttonText}>Press to Send Notification</Text>
     </TouchableOpacity>
     <Button title="Send Notification" onPress={sendNotification} /> */}
     {/* <Button title="Trigger Alarm" onPress={triggerAlarm} /> */}
     {/* <Button title="Play Sound" onPress={playSound} /> */}
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