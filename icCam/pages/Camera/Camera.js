import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import React, {useEffect, useState, useRef} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { Camera ,useCameraDevices } from 'react-native-vision-camera';
// import { RNCamera } from 'react-native-camera';
import { PermissionsAndroid } from 'react-native';
import App from '../../App';
// import { ViewPropsTyps } from 'deprecated-react-native-prop-types';


const MyCamera = () => {
  
    // const camera = useRef(null);
    // const [image, setImage] = useState(null);
    const cameraPermission =  Camera.getCameraPermissionStatus()
    const microphonePermission =  Camera.getMicrophonePermissionStatus()
    const devices = useCameraDevices()
    const device = devices.back

    // useEffect(() => {
    //     async function getPermission(){
    //       const permission = await Camera.requestCameraPermission();
    //       console.log('camera pormission status: ${permission}');
    //       if(permission === 'denied') await Linking.openSettings();
    //     }
    //     getPermission();
    //   },[]);

  function cupturePhoto () {

      return (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />)
    

    // const photo = await camera.current.takePhoto({});
    // if (camera.current !== null){
    //     const photo = await camera.current.takePhoto({});
    //     setImageSource(photo.path);
    //     setShowCamera(false);
    //     console.log(photo.path);
        
    // }
    // else{
    //     console.log("camera not conected")
    //     console.log(fdgfg);
    // }
  }


  

//  const takePicture = async () => {
//     if (camera.current) {
//       const photo = await camera.current.takePicture();
//       console.log(photo.uri);
      

//     }
//   }

  return (
    <View>
        <Text>Hello</Text>
        <TouchableOpacity style={styles.button} onPress={cupturePhoto}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>
      {/* {image && <Image source={{ uri: image }} style={{ flex: 1 }} />} */}
      <View style={styles.container}>
        {/* <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
        /> */}
        <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
        {/* <ImageBackground source={photo.path} style={styles.image}></ImageBackground> */}
      </View>
      
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