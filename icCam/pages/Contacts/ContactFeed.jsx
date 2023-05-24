import { Modal, StyleSheet, Text, View, TouchableOpacity, AppState } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { RTCView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs,deleteDoc, onSnapshot, setDoc, addDoc } from 'firebase/firestore';

const ContactFeed = ({contact, contactName}) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const [activeFeed, setActiveFeed] = useState(false);
    const [visible, setVisible] = useState(false); 
    const peerConnectionRef = useRef();
    const appStateRef = useRef(AppState.currentState)
    const iceHolder = []

  
    useEffect(() => {
        AppState.addEventListener('change', onAppClose);
        checkIfActive()
    }, []);

    // if there is a connection and the user wants to view it
    useEffect(()=>{
        const change = async ()=>{
            activeFeed && visible ? activateFeed():await closeConnection();
        }

        change();
    }, [activeFeed, visible])

    //the event that colses stuff when the app closes
    const onAppClose = (nextAppState)=>{
        if (nextAppState === 'background' || nextAppState == null ) {
            closeConnection().then(console.log("closed"))
            setVisible(false);
        }

    }

    // activating the connection to watch the feed
    const activateFeed = ()=>{
        setupWebRTC();
        createOffer();
    }

    // checking if thte feed for the current contact is active
    const checkIfActive = async()=>{
        const data = (await getDoc(doc(db,"LiveFeed",contact))).data();
        if(data && data["Active"]){
            setActiveFeed(true);
            listenToclose();
        }
    }
  
    //setting upp the webrtc peer connectionn
    const setupWebRTC = async() => {
        // the configurations for the peer connection
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
      
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        //making the peerconnection as receive only
        peerConnectionRef.current.addTransceiver('audio',{
            direction:'recvonly',
        })
        peerConnectionRef.current.addTransceiver('video',{
            direction:'recvonly',
        })

        // when getting a video track fromo remotet stream 
        peerConnectionRef.current.ontrack = (event) => {
        if (event.track.kind === 'video') {
            setRemoteStream(event.streams[0].toURL());
        }
        };

        // for debbuging - printing the changes in the connection and ice connection  
        peerConnectionRef.current.oniceconnectionstatechange = ()=>{
            console.log('ice Connection Status for the viewer', peerConnectionRef.current.iceConnectionState)
          }
        peerConnectionRef.current.onconnectionstatechange = ()=>{
            console.log('Connection Status for the viewer', peerConnectionRef.current.connectionState)
          }
    };
  
    // creating an offer to send to thee firebases to connect
    const createOffer = async()=>{
        if(peerConnectionRef.current){
            //refrencing the collections for the ice candidates of the offer and answer
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

            //waiting for the answer
            getAnswer(answerCollectionRef);
        }   
    }

    //getting the answer from the live feed
    const getAnswer = (answerCollectionRef)=>{

        //listening for a answer
        onSnapshot(doc(db,"LiveFeed",contact, "viewers", auth.currentUser.email),async snapshot=>{
            const data = snapshot.data();
            // if there is an answer add the remote description
            if (!peerConnectionRef.current.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                await peerConnectionRef.current.setRemoteDescription(answerDescription);
                
                // adding the ice candidates that arrived before the description
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

    // closing thte connection on the viewing  side
    const closeConnection = async()=>{
        // closing the peer connection if there is one
        if(peerConnectionRef.current){
            // peerConnectionRef.current._unregisterEvents();
            peerConnectionRef.current.close();
        }
    
        // deleteing the offer ice candidates
        const deleteOffers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "offerCandidates"))
        deleteOffers.docs.forEach(doc=>{
            deleteDoc(doc.ref);
        })
        
        // deleteing the answer ice candidates
        const deleteanswers = await getDocs(collection(db,"LiveFeed",contact,"viewers", auth.currentUser.email, "answerCandidates"))
        deleteanswers.docs.forEach(doc=>{
          deleteDoc(doc.ref);
        })
        // deleteing the viewing doc for the current user
        await deleteDoc(doc(db,"LiveFeed",contact,"viewers", auth.currentUser.email))
    
    }

    // a listener incase the live feed is stopped
    const listenToclose = async()=>{
        onSnapshot(doc(db,"LiveFeed", contact), snapshot=>{
            if(snapshot.data() && !snapshot.data()["Active"]){
                setActiveFeed(false);
                if(visible){
                    alert(contactName + " has closed the feed")
                }
                setVisible(false)
            }
            else{
                setActiveFeed(true);
            }
        })
    }
    
    if(!activeFeed)
        return null;

    return (
    
      <>
        {/* the modal for showing the feed */}
        <Modal visible = {visible}>
            {remoteStream?
            <RTCView
            streamURL={remoteStream}
            style={StyleSheet.absoluteFill}
            zOrder={1}
            />:
            <Text>Loading ......</Text>
            }

            {/* close button */}
            <TouchableOpacity onPress={()=>{setVisible(false)}}>
                <Text style={{fontSize:60}}>x</Text>
            </TouchableOpacity>
        </Modal>
        
        {/* button for oppening the  modal */}
        <View >
            <TouchableOpacity onPress={()=>{setVisible(true)}} style={styles.button}>
                <Text style={styles.buttonText}>Watch feed</Text>
            </TouchableOpacity>
        </View>
      </>
    );
}

export default ContactFeed

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        alignSelf: 'center',
        alignItems: 'center',
        width: '40%',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 50,
        backgroundColor: 'oldlace',
        marginHorizontal: '1%',
        marginBottom: 6,
        minWidth: '48%',
        textAlign: 'center',
        backgroundColor: `#8fbc8f`,
      },
      buttonText: {
        fontWeight: '800',
        fontSize: 15
      },
})