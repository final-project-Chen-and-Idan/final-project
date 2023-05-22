import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RTCView } from 'react-native-webrtc';
import { db } from '../../firebase';
import { collection, doc, doc, onSnapshot } from 'firebase/firestore';

const ContactFeed = ({contact}) => {
    const [remoteStreams, setRemoteStreams] = useState([]);
    const peerConnectionRefs = useRef({});
  
    useEffect(() => {
      setupWebRTC();
    }, []);
  
    const setupWebRTC = () => {
        onSnapshot(doc(db,"LiveFeed",contact), snapshot=>{
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
    };
  
    const handleOffer = async (offerId, offer) => {
      if (!peerConnectionRefs.current[offerId]) {
        peerConnectionRefs.current[offerId] = new RTCPeerConnection();
      }
  
      await peerConnectionRefs.current[offerId].setRemoteDescription(offer);
      const answer = await peerConnectionRefs.current[offerId].createAnswer();
      await peerConnectionRefs.current[offerId].setLocalDescription(answer);
  
      sendAnswerToFirestore(offerId, answer);
    };
  
    const sendAnswerToFirestore = (offerId, answer) => {
        const doc = doc(db,"LiveFeed", contact);
      const answerRef = databaseRef.current.doc(offerId).collection('answers').doc();
      answerRef.set({
        type: 'answer',
        sdp: answer.sdp,
      });
    };
  
    const handleClose = (offerId) => {
      if (peerConnectionRefs.current[offerId]) {
        peerConnectionRefs.current[offerId].close();
        delete peerConnectionRefs.current[offerId];
      }
    };
  
    const addRemoteStream = (offerId, stream) => {
      setRemoteStreams((prevStreams) => [...prevStreams, { offerId, stream }]);
    };
  
    const removeRemoteStream = (offerId) => {
      setRemoteStreams((prevStreams) => prevStreams.filter((stream) => stream.offerId !== offerId));
    };
  
    return (
      <View style={{ flex: 1 }}>
        {remoteStreams.map((stream) => (
          <RTCView key={stream.offerId} streamURL={stream.stream.toURL()} style={{ flex: 1 }} />
        ))}
      </View>
    );
}

export default ContactFeed

const styles = StyleSheet.create({})