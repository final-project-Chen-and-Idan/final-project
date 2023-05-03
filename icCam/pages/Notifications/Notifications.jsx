import { StyleSheet, Text, TouchableOpacity, View, Button, Platform, Alert } from 'react-native'
import { useState, useEffect, useRef, useContext } from 'react';
import { Audio } from 'expo-av';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';


const MyNotifications = ({context}) => {
  const [sound, setSound] = useState()
  const [play, setPlay] = useState(false)

useEffect(()=>{
  loadSound();
},[])

//loading the whether there is danger with a listener
useEffect (()=>{
  // getting theusers collection
  const ref = collection(db, 'Users');

  // creating a query to get the current user
  const que = query (ref, where("id",'==', auth.currentUser.uid));

  // calling the query
  const unsubscribe = onSnapshot(que, querySnapshot => {
    querySnapshot.docs.forEach(docs=>{
      // if there is danger play the alarm
      let danger = docs.data().danger
      if(danger){
        setPlay(true);
        // alert box to turn off the alarm
        Alert.alert(
          "Danger",
          "press here to turn off the alarm",
          [
            {
              text: "Stop Alarm",
              onPress: () => {
                setPlay(false)
                update_ref = doc(db, "Users", docs.id)
                updateDoc(update_ref,{"danger":false});
              },
            },
          ],
        );
        // add here notification later ---------------------------------------

      }
    })
  });
  
  return ()=>unsubscribe()
  },[])

useEffect(()=>{
  play?playSound():stopSound()
  
},[play])

const loadSound = async()=>{
  console.log('Loading Sound');
  const { sound } = await Audio.Sound.createAsync( require('../../assets/alarm.mp3'));
  setSound(sound);
}

const playSound = async() => {
  if(!sound)
    loadSound()
  console.log('Playing Sound');
  await sound.playAsync();
}

const stopSound = async ()=> {
  try{
    if(sound != undefined)
      sound.unloadAsync();
    setSound(null);
  }
  catch(e){
    console.log(e);
  }
}

  return (
    <View>
      {/* // <TouchableOpacity style = {styles.button}>
      //     <Text style={styles.buttonText}>Press to Send Notification</Text>
      // </TouchableOpacity>
      // <Button title="play sound" onPress={playSound} />
      // <Button title="stop sound" onPress={stopSound} /> */}
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