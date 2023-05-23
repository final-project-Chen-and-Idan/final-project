import { StyleSheet,PermissionsAndroid,TouchableOpacity, Text, View} from 'react-native'
import React, { useState, useRef, useEffect} from 'react';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import {auth, db} from '../../firebase';
import {doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';


const MyCamera = () => {
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef({});
  const [permission, setPermission] = useState(false);
  const [direction, setDirection] = useState("environment");//or environment
  const [loading, setLoading] = useState(true);
  
  //getting the permissions for the camera
  const getPermision = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'the live feed need camera permissions',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        setPermission(true);
        return true;
      } else {
        alert('Camera permission denied');
        setPermission(false);
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  useEffect(()=>{
    const start = async()=>{
      cameraPermission = await getPermision();
      if(cameraPermission){
        await startMediaStream();
        listenToConnection()
        setLoading(false);
      }
    }
    start();

    return ()=>{
      // closeStream();
    }
  },[]);
  
  //todo clear the data and close connections ---------------------------
  const closeStream = async()=>{
    if(peerConnectionRef.current)
      for(item in peerConnectionRef.current){
        peerConnectionRef.current[item].close()
      }

    const deleteOffers = await getDocs(collection(db,"LiveFeed",auth.currentUser.email, "offerCandidates"))
    deleteOffers.docs.forEach(doc=>{
      deleteDoc(doc.ref);
    })

    const deleteanswers = await getDocs(collection(db,"LiveFeed",auth.currentUser.email, "answerCandidates"))
    deleteOffers.docs.forEach(doc=>{
      deleteDoc(doc.ref);
    })
    deleteDoc(doc(db,"LiveFeed",auth.currentUser.email))

    if(localStreamRef.current)
    localStreamRef.current.getTracks().forEach(t => t.stop());
    localStreamRef.current.release();


  }

  // starting the camera stream for sharing
  const startMediaStream = async () => {
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 640,
          minFrameRate: 30,
        },
        facingMode:direction
      },
    };
    try {
      console.log("setting up the local stream")
      const stream = await mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      setDoc(doc(db,"LiveFeed", auth.currentUser.email),{})

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const listenToConnection = ()=>{
    onSnapshot(collection(db,"LiveFeed",auth.currentUser.email,"viewers"), snapshot=>{
      const changes = snapshot.docChanges();
      changes.forEach((change) => {
          const doc = change.doc;
          const offer = doc.data();
          const offerId = doc.id;
          
          if (change.type === 'added') {
              handleOffer(offerId, offer);
          } else if (change.type === 'removed') {
              handleClose(offerId);
          }
      });
    })
  }

  // handling a offer
  const handleOffer = async (offerId, offer) => {
    // if this is a brand new connection
    if (!peerConnectionRef.current[offerId]) {
      setupWebRTC(offerId);
    }

    await peerConnectionRef.current[offerId].setRemoteDescription(offer["offer"]);
    const answer = await peerConnectionRef.current[offerId].createAnswer();
    await peerConnectionRef.current[offerId].setLocalDescription(answer);

    sendAnswerToFirestore(offerId, answer);
  };  

  const handleClose = (offerId) => {
    if (peerConnectionRef.current[offerId]) {
      peerConnectionRef.current[offerId].close();
      delete peerConnectionRef.current[offerId];
    }
  };

  // setting up the webrtc connection
  const setupWebRTC = (id) => {
    // the stun servers for the ice candidates(ip - port pairs)
    const configuration = {
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
      iceCandidatePoolSize: 10
    };

    peerConnectionRef.current[id] = new RTCPeerConnection(configuration);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current[id].addTrack(track, localStreamRef.current);
    });


    //making the peerconnection as sending only
    peerConnectionRef.current[id].addTransceiver('audio',{
      direction:'sendonly',
    })
    peerConnectionRef.current[id].addTransceiver('video',{
        direction:'sendonly',
    })

    const answerCollectionRef = collection(db,"LiveFeed",auth.currentUser.email,"viewers",id,"answerCandidates");

    //getting the ice candidates
    peerConnectionRef.current[id].onicecandidate = async(event) => {
      if(event.candidate)
      await addDoc(answerCollectionRef,(event.candidate.toJSON()))
    };    

  };

  const sendAnswerToFirestore = async (offerId, answer) => {
    const docRef = doc(db,"LiveFeed", auth.currentUser.email, "viewers", offerId);
    await updateDoc(docRef,{
      answer : {
        type: 'answer',
        sdp: answer.sdp,
      }
    });
  };
  
  const startFeed = async () => {
    if (peerConnectionRef.current) {
      
      //refrencing the collections for the ice candidates both for the livefeed and 
      const offerCollectionRef = collection(db,"LiveFeed",auth.currentUser.email,"offerCandidates");
      const answerCollectionRef = collection(db,"LiveFeed",auth.currentUser.email,"answerCandidates");
      
      // Get the ice candidates for livefeed and add it to the firebase
      peerConnectionRef.current.onicecandidate = async(event) => {
        if(event.candidate)
        await addDoc(offerCollectionRef,(event.candidate.toJSON()))
      };
      
      // creating the offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      //adding the offer to firebase
      await setDoc(doc(db,"LiveFeed", auth.currentUser.email),{
        offer:{
          type: 'offer',
          sdp: offer.sdp
        }
      });


      //listening for a answer
      onSnapshot(doc(db,"LiveFeed",auth.currentUser.email),snapshot=>{
        const data = snapshot.data();

        if (!peerConnectionRef.current.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          peerConnectionRef.current.setRemoteDescription(answerDescription);
        }
      })

      // adding the ice candidates for the answer
      onSnapshot(answerCollectionRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            peerConnectionRef.current.addIceCandidate(candidate);
          }
        });
      });
    }
  };

  const changeDirection = ()=>{
    direction == "user"?
    setDirection("environment"):
    setDirection("user");

    closeStream();
    startMediaStream();
  }

  if(!permission){
   return(
    <View>
      <Text>no access</Text>
      <TouchableOpacity onPress={getPermision}>
        <Text>give permission</Text>
      </TouchableOpacity>
    </View>
    )
  }

  if(loading){
    return(
      <View>
        <Text>Loading ....</Text>
      </View>
      )
  }

  return(
    <View style={{ flex: 1 }}>
      {localStreamRef.current?
        <RTCView
          streamURL={localStreamRef.current.toURL()}
          style={StyleSheet.absoluteFill}
        />:
        null
        }
    </View>
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