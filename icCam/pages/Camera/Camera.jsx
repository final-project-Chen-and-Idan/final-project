import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState} from 'react';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';

const MyCamera = () => {
  const [cameraDirection, setCameraDirection] = useState(false)
  const [activeCamera, setActiveCamera] = useState (false)

  // activates the camera and asks for permission on the way
  const startCamera = async () => {
    // gets the permission
    const {status} = await Camera.requestCameraPermissionsAsync()
    // saying the camera is active
    if(status === 'granted'){
      setActiveCamera(true)
    }
    // access was not given
    else{
      alert("you denied access")
    }
  }

  // when screen loads activate the camera
  useEffect(()=>{
    startCamera()
  },[])
    
  return (
    <>
    {activeCamera?
      <View>
        <Camera
        type={cameraDirection?"front": "back"}
        style={{width: "100%", height: 550}}
        />
        <TouchableOpacity 
        onPress={()=>{
          cameraDirection?setCameraDirection(false):
                          setCameraDirection(true)}}>
          <Icon name="md-camera-reverse" size={20}/>
        </TouchableOpacity>
      </View>
      :
      <View>
        <Text>no access</Text>
        <TouchableOpacity onPress={startCamera}>
          <Text>get permission</Text>
        </TouchableOpacity>
      </View>
    }
    </>
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