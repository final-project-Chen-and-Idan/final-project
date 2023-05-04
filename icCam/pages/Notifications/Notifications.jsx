import { Alert } from 'react-native'
import { useState, useEffect, useRef, useContext } from 'react';
import { Audio } from 'expo-av';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';


const Notifications = ({context}) => {
  const [sound, setSound] = useState()
  const [play, setPlay] = useState(false)


  useEffect(()=>{
    loadSound();
  },[])

  //loading the whether there is danger with a listener
  useEffect (()=>{
    // getting the users collection
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
                  loadSound()
                },
              },
            ],
          );
          // add here notification later ------------------------------------------------------------------

        }
      })
    });
    
    return ()=>unsubscribe()
    },[])

  // palying or stopping the sound based on the play variable
  useEffect(()=>{
    play?playSound():stopSound()
    
  },[play])

  // loading the sound to be played
  const loadSound = async()=>{
    const { sound } = await Audio.Sound.createAsync( require('../../assets/alarm.mp3'));
    setSound(sound);
  }

  // playing the alarm
  const playSound = async() => {
    if(!sound)
      loadSound()
    console.log('Playing Sound');
    await sound.playAsync();
  }

  // stopping the alarm by unloading it
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
    <>  
    </>
  );
}
export default Notifications
