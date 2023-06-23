import { StyleSheet,PermissionsAndroid,TouchableOpacity, Text, View, AppState} from 'react-native'
import React, { useState, useRef, useEffect} from 'react';
import { RTCPeerConnection, RTCView, mediaDevices, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import {auth, db} from '../../firebase';
import {doc, setDoc, onSnapshot, collection, addDoc, getDocs, updateDoc, getDoc, query, where } from 'firebase/firestore';


const MyCamera = () => {
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef({});
  const [permission, setPermission] = useState(false);
  const [direction, setDirection] = useState("environment");//or user
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
    AppState.addEventListener('change',changeEvent )
    const start = async()=>{
      cameraPermission = await getPermision();
      if(cameraPermission){
        await startMediaStream();
        listenToConnection()
        setLoading(false);
      }
    }
    start();

    return async()=>{
      await closeStream();
    }
  },[]);

  // closes the connection when the app is closed
  const changeEvent = (nextAppState)=>{
    if (nextAppState === 'background' || nextAppState == null ) {
      closeStream().then(console.log("closed livestream"))
  }
  }
  
  //todo clear the data and close connections ------------------------------------------------------------------------------------------------------------
  const closeStream = async()=>{
    console.log(peerConnectionRef.current)
    
    await updateDoc(doc(db,"LiveFeed",auth.currentUser.email), {"Active" : false})

    if(localStreamRef.current){
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current.release();
    }
    
    for(item in peerConnectionRef.current){
      if(peerConnectionRef.current[item]){
        peerConnectionRef.current[item].close()
        delete peerConnectionRef.current[item];
      }
      
    }
    console.log(peerConnectionRef.current)
    peerConnectionRef.current = {}
  }

  // starting the camera stream for sharing
  const startMediaStream = async () => {
    // constraint for the local media device
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 640,
          minFrameRate: 60,
        },
        facingMode:direction
      },
    };
    try {
      // setting up the local stream
      const stream = await mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // adding a doc to hold all of the viewers
      setDoc(doc(db,"LiveFeed", auth.currentUser.email),{"Active" : true})

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  //listening to incomming connections
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

  // handling a offer when someone wants to connect
  const handleOffer = async (offerId, offer) => {
 
    // if this is a brand new connection
    if (!peerConnectionRef.current[offerId]) {
      setupWebRTC(offerId);
    }

    // setting the remote and local description
    await peerConnectionRef.current[offerId].setRemoteDescription(new RTCSessionDescription(offer["offer"]));
    const answer = await peerConnectionRef.current[offerId].createAnswer();
    await peerConnectionRef.current[offerId].setLocalDescription(answer);

    
    // listening to the offer ice candidates to add 
    const offerCollectionRef = collection(db, "LiveFeed", auth.currentUser.email, "viewers", offerId, "offerCandidates")
    onSnapshot(offerCollectionRef, (snapshot) => {
      const changes = snapshot.docChanges(); 
      changes.forEach((change) => {
          if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              peerConnectionRef.current[offerId].addIceCandidate(candidate);
          }
      });
    });
    
    // adding existing ice candidates
    const offerCandidates = await getDocs(offerCollectionRef);
    offerCandidates.docs.forEach(doc=>{
      const candidate = new RTCIceCandidate(doc.data());
      peerConnectionRef.current[offerId].addIceCandidate(candidate);
    })

    sendAnswerToFirestore(offerId, answer);
  };  

  // handles closing a connection when someone disconnects
  const handleClose = (offerId) => {
    console.log("closeing connection for " + offerId)
    if (peerConnectionRef.current[offerId]) {
      peerConnectionRef.current[offerId].close();
      delete peerConnectionRef.current[offerId];
    }
  };

  // setting up the webrtc connection
  const setupWebRTC = (id) => {
    // the stun servers for the ice candidates
    const configuration = {
      iceServers: [
        {
          urls: "stun:a.relay.metered.ca:80",
        },
        {
          urls: "turn:a.relay.metered.ca:80",
          username: "2f02eed12f0f526544c1a6c8",
          credential: "eBSRDZmuIEXyUuXV",
        },
        {
          urls: "turn:a.relay.metered.ca:80?transport=tcp",
          username: "2f02eed12f0f526544c1a6c8",
          credential: "eBSRDZmuIEXyUuXV",
        },
        {
          urls: "turn:a.relay.metered.ca:443",
          username: "2f02eed12f0f526544c1a6c8",
          credential: "eBSRDZmuIEXyUuXV",
        },
        {
          urls: "turn:a.relay.metered.ca:443?transport=tcp",
          username: "2f02eed12f0f526544c1a6c8",
          credential: "eBSRDZmuIEXyUuXV",
        },
      ],
      iceCandidatePoolSize: 10
    };

    // creating the peer connecetion
    peerConnectionRef.current[id] = new RTCPeerConnection(configuration);

    // adding thte local stream to the peer connection 
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

    // for debug - print the connectiton and ice connection status 
    peerConnectionRef.current[id].oniceconnectionstatechange = ()=>{
      if(peerConnectionRef.current[id])
        console.log('ice Connection Status for the live feed', peerConnectionRef.current[id].iceConnectionState)
    }
    peerConnectionRef.current[id].onconnectionstatechange = ()=>{
      if(peerConnectionRef.current[id])
        console.log('Connection Status for the live feed', peerConnectionRef.current[id].connectionState)
    }
  };

  // upload an answer to the firestore for the correct offer
  const sendAnswerToFirestore = async (offerId, answer) => {
    const docRef = doc(db,"LiveFeed", auth.currentUser.email, "viewers", offerId);
    await updateDoc(docRef,{
      answer : {
        type: 'answer',
        sdp: answer.sdp,
      }
    });
  };

  // return a list of active users
  const getActiveUsers = async()=>{
    const query  = query(collection(db, "Users"), where("id","==", auth.currentUser.uid))
    const contacts = await getDocs(query);

    const actives = []

    // looping through the contacts and taking the active ones
    contacts.docs.forEach(doc=>{
      let c = doc.data().contacts
      for(cont in c){
        if(c[cont]["active"])
          actives.push(c[cont]["email"])
      }
    })

    return actives
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
    <View style={{flex:1,  backgroundColor:"black" }}>
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
  
})