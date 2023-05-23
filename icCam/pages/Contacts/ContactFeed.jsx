import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { RTCView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs,deleteDoc, onSnapshot, setDoc, addDoc } from 'firebase/firestore';

const ContactFeed = ({contact}) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const [activeFeed, setActiveFeed] = useState(false);
    const peerConnectionRef = useRef();
    const iceHolder = []

  
    useEffect(() => {
        const startup = async()=>{
            const active = await checkIfActive()
            
            if(active)
                setupWebRTC();
                createOffer();
        }

        startup();
        return () => {closeConnection()}
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
            setRemoteStream(event.streams[0].toURL());
        }
        };

        peerConnectionRef.current.oniceconnectionstatechange = ()=>{
            console.log('ice Connection Status for the viewer', peerConnectionRef.current.iceConnectionState)
          }
        peerConnectionRef.current.onconnectionstatechange = ()=>{
            console.log('Connection Status for the viewer', peerConnectionRef.current.connectionState)
          }
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
        onSnapshot(doc(db,"LiveFeed",contact, "viewers", auth.currentUser.email),async snapshot=>{
            const data = snapshot.data();
            if (!peerConnectionRef.current.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                await peerConnectionRef.current.setRemoteDescription(answerDescription);

                iceHolder.forEach(candidate=>{
                    peerConnectionRef.current.addIceCandidate(candidate);
                })
            }
            
        })
        
        // adding the ice candidates for the answer
        onSnapshot(answerCollectionRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    
                    if(peerConnectionRef.current.currentRemoteDescription){
                        peerConnectionRef.current.addIceCandidate(candidate);
                    }
                    else{
                        iceHolder.push(candidate);
                    }
                }
            });
        });
    }


    const closeConnection = async()=>{
        if(peerConnectionRef.current){
            // peerConnectionRef.current._unregisterEvents();
            peerConnectionRef.current.close();
        }
    
        const deleteOffers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "offerCandidates"))
        deleteOffers.docs.forEach(doc=>{
          deleteDoc(doc.ref);
        })
    
        const deleteanswers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "answerCandidates"))
        deleteanswers.docs.forEach(doc=>{
          deleteDoc(doc.ref);
        })
        await deleteDoc(doc(db,"LiveFeed",contact,"viewers", auth.currentUser.email))
    
    }
  
    return (
      <View >
        {remoteStream?
        <RTCView
          streamURL={remoteStream}
          style={{height:500, width:300}}
          zOrder={1}
        />:
        null
        }
        
      </View>
    );
}

export default ContactFeed

const styles = StyleSheet.create({})