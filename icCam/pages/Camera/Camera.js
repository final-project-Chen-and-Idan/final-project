import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import React, {useEffect, useState, useRef} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { Camera } from 'react-native-vision-camera';






const MyCamera = () => {

    const camera = useRef(null);
    const [image, setImage] = useState(null);


    useEffect(() => {
        async function getPermission(){
          const permission = await Camera.requestCameraPermission();
          console.log('camera pormission status: ${permission}');
          if(permission === 'denied') await Linking.openSettings();
        }
        getPermission();
      },[]);

  const cupturePhoto = async () => {
    if (camera.current !== null){
        const photo = await camera.current.takePhoto({});
        setImageSource(photo.path);
        setShowCamera(false);
        console.log(photo.path);
    }
  }

//   render() {
//     return (
//       <Camera
//         style={styles.preview}
//         type={Camera.Constants.Type.back}
//       />
//     );
//   }
  

 const takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePicture();
      console.log(photo.uri);

    }
  }

  return (
    <View>
        <Text>Hello</Text>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
      
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