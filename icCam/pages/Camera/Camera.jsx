import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState} from 'react';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';
// import Tflite from 'tflite-react-native';
// import {RNCamera} from 'react-native-camera-tflite'

// const tflite = new Tflite();


const MyCamera = () => {
  const [cameraDirection, setCameraDirection] = useState(false)
  const [activeCamera, setActiveCamera] = useState (false)
  const [model, setModel] = useState(null)

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
                          <View style = {styles.iconView}>
                            <Icon style={styles.iconButton} name="md-camera-reverse" size={20}/>
                          </View>
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
      iconView: {
        alignSelf: 'center',
        // height: '5%'
        backgroundColor: `#daa520`,
        borderRadius: 100,
        height: 40,
        width: 40,


      },
      iconButton: {
        // height: '80%',
        // backgroundColor: `#daa520`,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 9,
        height: '90%',
        // width: '90%'

      }
})