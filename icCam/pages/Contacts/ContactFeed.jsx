import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { RTCView, RTCPeerConnection, MediaStream, RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs,deleteDoc, onSnapshot, setDoc, addDoc } from 'firebase/firestore';

const ContactFeed = ({contact}) => {
    const remoteStreamRef = useRef(null);
    const [activeFeed, setActiveFeed] = useState(false);
    const peerConnectionRef = useRef();

  
    useEffect(() => {
        const startup = async()=>{
            const active = await checkIfActive()
            
            if(active)
                setupWebRTC();
                createOffer();
        }

        startup();
        return closeConnection
    }, []);

    const checkIfActive = async()=>{
        const data = (await getDoc(doc(db,"LiveFeed",contact))).data();
        if(data)
            return true
        return false
    }
  
    const setupWebRTC = async() => {
        // the configurations for the peerconnection
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
      
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        //making the peerconnection as receive only
        peerConnectionRef.current.addTransceiver('audio',{
            direction:'recvonly',
        })
        peerConnectionRef.current.addTransceiver('video',{
            direction:'recvonly',
        })

        // when getting a video track add it to 
        peerConnectionRef.current.ontrack = (event) => {
        if (event.track.kind === 'video') {
            remoteStreamRef.current = event.streams[0];
            console.log(remoteStreamRef.current)
        }
        };
    };
  
    const createOffer = async()=>{
        if(peerConnectionRef.current){
            //refrencing the collections for the ice candidates of the offer
            const offerCollectionRef = collection(db,"LiveFeed",contact,"viewers",auth.currentUser.email,"offerCandidates");
            const answerCollectionRef = collection(db,"LiveFeed",contact,"viewers",auth.currentUser.email,"answerCandidates");
            
            //getting the ice candidates
            peerConnectionRef.current.onicecandidate = async(event) => {
                if(event.candidate)
                await addDoc(offerCollectionRef,(event.candidate.toJSON()))
            };


            // creating the offer
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            
            //adding the offer to firebase
            await setDoc(doc(db,"LiveFeed", contact, "viewers", auth.currentUser.email),{
                offer:{
                type: 'offer',
                sdp: offer.sdp
                }
            });

            getAnswer(answerCollectionRef);
        }   
    }

    //getting the answer from the live feed
    const getAnswer = (answerCollectionRef)=>{

        //listening for a answer
        onSnapshot(doc(db,"LiveFeed",contact, "viewers", auth.currentUser.email),snapshot=>{
            const data = snapshot.data();
            console.log("over here")
            if (!peerConnectionRef.current.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                peerConnectionRef.current.setRemoteDescription(answerDescription);
            }
            
        })
        
        // adding the ice candidates for the answer
        onSnapshot(answerCollectionRef, (snapshot) => {
            console.log("now over here")
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerConnectionRef.current.addIceCandidate(candidate);
                }
            });
        });
    }


    const closeConnection = async()=>{
        if(peerConnectionRef.current)
          peerConnectionRef.current.close();
    
        const deleteOffers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "offerCandidates"))
        deleteOffers.docs.forEach(doc=>{
          deleteDoc(doc.ref);
        })
    
        const deleteanswers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "answerCandidates"))
        deleteanswers.docs.forEach(doc=>{
          deleteDoc(doc.ref);
        })
        deleteDoc(doc(db,"LiveFeed",contact,"viewers", auth.currentUser.email))
    
    }
    
     
    // const addRemoteStream = (offerId, stream) => {
    //   setRemoteStreams((prevStreams) => [...prevStreams, { offerId, stream }]);
    // };
  
    // const removeRemoteStream = (offerId) => {
    //   setRemoteStreams((prevStreams) => prevStreams.filter((stream) => stream.offerId !== offerId));
    // };
  
    return (
      <View style={{backgroundColor:"black",height:500, width:300}}>
        {remoteStreamRef.current?
        <RTCView
          streamURL={remoteStreamRef.current.toURL()}
        />:
        null
        }
        
      </View>
    );
}

export default ContactFeed

const styles = StyleSheet.create({})