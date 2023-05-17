// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect } from 'react'
// import { collection } from 'firebase/firestore';
// import {db} from '../../firebase'
// import {
//     mediaDevices,
//     RTCPeerConnection,
//     RTCView,
//     RTCIceCandidate,
//     RTCSessionDescription,
//   } from 'react-native-webrtc';

// const servers = {
//     iceServers:[
//         {
//         urls:[
//             "stun:stun1.l.google.com.19302",
//             "stun:stun2.l.google.com.19302"
//         ]
//         }
//     ],
//     iceCandidatePoolSize:10,
// }

// //   creating a new peer connection
// const peerConnection = new RTCPeerConnection(servers);

// const Connection = () => {
//     // gettting the cameara stream of the local user
//     const [localStream, setlocalStream] = useState(null);
//     //the video feed from the 
//     const [remoteStream, setRemoteStream] = useState(null);

//     let isFront = false;
  
//   /*The MediaDevices interface allows you to access connected media inputs such as cameras and
//    microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
//    const handleCamera = async()=>{
//         //getting the information about the phone camera devices 
//         const cameraSources = await mediaDevices.enumerateDevices()
//         console.log(cameraSources)
//         cameraSources.array.forEach(item => {
//             console.log(item)
//         });

//    }

//    useEffect(()=>{
//     handleCamera()
//    },[])
   
// //    mediaDevices.enumerateDevices().then(sourceInfos => {
//     let videoSourceId;
//     for (let i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if (
//         sourceInfo.kind == 'videoinput' &&
//         sourceInfo.facing == (isFront ? 'user' : 'environment')
//         ) {
//         videoSourceId = sourceInfo.deviceId;
//         }
//     }
//     mediaDevices
//           .getUserMedia({
//             audio: true,
//             video: {
//               mandatory: {
//                 minWidth: 500, // Provide your own width, height and frame rate here
//                 minHeight: 300,
//                 minFrameRate: 30,
//               },
//               facingMode: isFront ? 'user' : 'environment',
//               optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//             },
//           })
//           .then(stream => {
//             // Get local stream!
//             setlocalStream(stream);
  
//             // setup stream listening
//             peerConnection.current.addStream(stream);
//           })
//           .catch(error => {
//             // Log error
//           });
//     //   });

//     return (
//     <View>
//       <Text>Connection</Text>
//     </View>
//   )
// }

// export default Connection

// const styles = StyleSheet.create({})


  
// export  function App({}) {
  
//       useEffect(() => {
//       socket.on('newCall', data => {
//        /* This event occurs whenever any peer wishes to establish a call with you. */
//       });
  
//       socket.on('callAnswered', data => {
//         /* This event occurs whenever remote peer accept the call. */
//       });
  
//       socket.on('ICEcandidate', data => {
//         /* This event is for exchangin Candidates. */
  
//       });
  
      
  
  
        
  
//       peerConnection.current.onaddstream = event => {
//         setRemoteStream(event.stream);
//       };
  
//       // Setup ice handling
//       peerConnection.current.onicecandidate = event => {
  
//       };
  
//       return () => {
//         socket.off('newCall');
//         socket.off('callAnswered');
//         socket.off('ICEcandidate');
//       };
//     }, []);
  
//   }