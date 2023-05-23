import { Alert } from 'react-native'
import { useState, useEffect, useRef, useContext } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import  Sound from 'react-native-sound'
import SendNotification from './SendNotification';

const Notifications = () => {
  const [sound, setSound] = useState()
  const [play, setPlay] = useState(false)


  //loading and releasing the sound
  useEffect(()=>{
    loadSound();
    return ()=>{if(sound)sound.release()}
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
                },
              },
            ],
          );
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
    Sound.setCategory('Playback');
    let sound = new Sound("alarm.mp3", Sound.MAIN_BUNDLE, (error)=>{
      if(error){
        console.log("failed to load sound", error);
        return;
      }
      // loaded successfully
      setSound(sound);

      // making sure the valume is up
      sound.setVolume(1);
      // Loop indefinitely until stop() is called
      sound.setNumberOfLoops(-1);
    })
   
  }

  // playing the alarm
  const playSound = async() => {
    if(!sound)
      loadSound()

    console.log('Playing Sound');
    await sound.play();
  }

  // stopping the alarm by unloading it
  const stopSound = async ()=> {
    try{
      if(sound)
        sound.stop();
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <>  
    <SendNotification/>
    </>
  );
}
export default Notifications
