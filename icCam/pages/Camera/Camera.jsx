import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState, useRef} from 'react';
import { Camera } from 'expo-camera';
import { async } from '@firebase/util';


const MyCamera = () => {
    const [activeCamera, setActiveCamera] = useState (false)
   const startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    if(status === 'granted'){
      setActiveCamera(true)
    }
    else{
      alert("access denied")
    }
   }
    
  return (
  <View>
{
activeCamera?
  <Camera
  type={"front"}
  style={{width: "100%", height: 550}}
  >

  
  </Camera>:
  <View>
    <Text>no access</Text>
    <TouchableOpacity onPress={startCamera}>
      <Text>get permission</Text>
    </TouchableOpacity>
  </View>
}
  </View>
  )
}

export default MyCamera

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        width: '40%',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 50,
        
        alignSelf: 'center',
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