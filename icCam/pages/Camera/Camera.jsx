import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState, useRef} from 'react';
import { Camera } from 'expo-camera';


const MyCamera = () => {

    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const devices = useCameraDevices()
    const device = devices.back


    useEffect(() => {
        async function getPermission(){
          const permission = await Camera.requestCameraPermission();
          console.log('camera pormission status: ${permission}');
          if(permission === 'denied') await Linking.openSettings();
        }
        getPermission();
      },[]);

  const cupturePhoto = async () => {
    alert("gfsdgf");
    const permission = await Camera.requestCameraPermission();
    if (camera.current !== null){
        const photo = await camera.current.takePhoto({});
        setImageSource(photo.path);
        setShowCamera(false);
        console.log(photo.path);
        alert("gfsdgf");
        
    }
    else{
        console.log("camera not conected")
        console.log(gdf);
        alert("camera not conected");
        
    }
  }

  if (device == null) return <LoadingView />
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
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