import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState, useRef, createContext} from 'react';
// import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';
// import { io } from 'socket.io-client';
// import Connection from './Connection';
import { Camera ,useCameraDevices} from 'react-native-vision-camera';

const MyCamera = () => {
  const cameraRef = useRef(null);
  const [permission, setPermission] = useState(false);
  const devices = useCameraDevices()
  const [cameraType, setCameraType] = useState(devices.back);
  const [activeUsers, setActiveUsers] = useState([])
  
  // let socket;
  //asks for the camera permissions
  const cameraPermissions = async()=>{
     // Camera permission.
     const status = await Camera.getCameraPermissionStatus()
     // saying the camera is active
     if(status == 'authorized'){
      setPermission(true)
      const devices = await Camera.getAvailableCameraDevices()
     }
     // access was not given
     else{
      alert("you denied access")
      setPermission(false)
     }
  }
  // const cameraPermissions = async()=>{
  //    // Camera permission.
  //    const {status} = await Camera.requestCameraPermissionsAsync()
  //    // saying the camera is active
  //    if(status == 'granted'){
  //     setPermission(true)
  //     return true;
  //    }
  //    // access was not given
  //    else{
  //     alert("you denied access")
  //     setPermission(false)
  //     return false;
  //    }
  // }

  useEffect(()=>{
     cameraPermissions();
  },[])
  // useEffect(()=>{
  //   const server_URL = "http://192.168.1.36:3001"
  //   socket = io(server_URL)
  //   socket.on("connection",()=>console.log("connected"))
  //   joinRoom()
  //   socket.on("all-users",users=>{
  //     console.log(users)
  //     // setActiveUsers(users.filter(item=>item.userName != auth.currentUser.displayName))
  //     setActiveUsers(users)
  //   })
  //   // clean up on unmount
  //   return ()=>{
  //     console.log("unmount")
  //     disconnect()
  //   }
  // },[])


  // const joinRoom = ()=>{
  //   socket.emit('join-room',{
  //     roomId: auth.currentUser.email,
  //     userName: auth.currentUser.displayName
  //   })
  // }

  // const disconnect = ()=>{
  //   socket.on("disconnect",()=>{
  //     console.log("disconnected")
  //   })
  // }

  if(!permission || cameraType == null){
   return(
    <View>
      <Text>no access</Text>
      <TouchableOpacity onPress={cameraPermissions}>
        <Text>get permission</Text>
      </TouchableOpacity>
    </View>
    )
  }

  return(
    <>
      {/* <Connection/> */}
      <View style={StyleSheet.absoluteFill}>
        <Camera
          ref={cameraRef}
          device={cameraType}
          style = {StyleSheet.absoluteFill}
          onCameraReady={()=>alert("remember to put you volume all the way up")}
        />
        {/* <Camera
          ref={cameraRef}
          type={cameraType}
          style = {StyleSheet.absoluteFill}
          onCameraReady={()=>alert("remember to put you volume all the way up")}
        /> */}
        <TouchableOpacity 
        onPress={()=>{
          cameraType==devices.back?
          setCameraType(devices.front):
          setCameraType(devices.back)}}>
          <View style = {styles.iconView}>
            <Icon style={styles.iconButton} name="md-camera-reverse" size={40}/>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default MyCamera

const styles = StyleSheet.create({
    camera: {
      width:'90%',
      height:'80%',
      zIndex: 1,
      alignSelf: 'center',
      borderRadius: 30,
      borderWidth: 6
    },
    view:{
      justifyContent:'flex-end'
    },
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
        position:'absolute',
        // bottom:30,
        backgroundColor: `#daa520`,
        borderRadius: 100,
        height: 60,
        width: 60,


      },
      iconButton: {
        // height: '80%',
        // backgroundColor: `#daa520`,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 9,
        height: '90%',
        // width: '90%'
      },
      canvas:{
        position: 'absolute',
        height:'100%',
        width: '100%',
        zIndex: 1000000,

      }
})