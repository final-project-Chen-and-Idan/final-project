import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, FlatList, ToastAndroid, Alert, ImageBackground, Image} from 'react-native'
import React, { useState, useEffect} from 'react'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { collection, query, onSnapshot, where, getDocs, updateDoc} from 'firebase/firestore'
import {auth, db} from "../../firebase"
import  Icon from 'react-native-vector-icons/Ionicons'
import { BackgroundImage } from 'react-native-elements/dist/config'

const Contacts = () => {
  const image = { uri: "https://img.freepik.com/free-vector/scene-swimming-pool-with_1308-37683.jpg" }
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [contacts, setContacts] = useState([]) 
  
  //toggle the active status for the contact 
  const toggleActive = async(user)=>{
      // updating the contact list
      let updatedContactList = {}
      contacts.forEach(item=>{
        updatedContactList[item.email] = item;
        if(item.email == user.email)
          updatedContactList[item.email].active = user.active?false:true
      })

      //syncing with firebase
      const q = query(collection(db, "Users"), where("id", "==", auth.currentUser.uid))
      const docs = await getDocs(q);
      docs.forEach(async(doc)=>{
        await updateDoc(doc.ref,{contacts:updatedContactList})
      })
  }

  //removes a contact
  const deleteContact = (contact)=>{
    console.log(contact)
    Alert.alert(
      "delete?",
      "are you sure you want to delete this user",
      [
        {
          text: "cancle",
          onPress: () => {return},
        },
        {
          text: "delete",
          onPress: async () => {
             await handleUserSide(contact, false);
             handleRequsteeSide(contact, true)
          },
      },
  ],
  );

    return false;
  }

  //the contact component
  const Contact = ({user})=>{
    return(
      <TouchableOpacity onLongPress={()=>{deleteContact(user)}}>
        <View style={styles.contactsItem}>
          <Text style={styles.contactsItemText}   >name: {user.name}</Text>
          <Text style={styles.contactsItemText}  >email: {user.email}</Text>
          <TouchableOpacity style={styles.contactsItemButton} onPress={()=>toggleActive(user)}>
            <Text style={styles.contactsItemButtonText}>{user.active?"Active":"not Active"}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  //the request Component
  const RequestItem = ({user})=>{
    return(
      <View>
        <Text>
          name:{user.name} email:{user.email}
        </Text>
        {/* accept request */}
        <TouchableOpacity onPress={()=>handleRequest(true, user)}>
          <Text>Accept</Text>
        </TouchableOpacity>

        {/* deny request */}
        <TouchableOpacity onPress={()=>handleRequest(false, user)}>
          <Text>Deny</Text>
        </TouchableOpacity>
      </View>
    )
  }

  //updates the contact list on the user side
  const handleUserSide = async(requestee, accepted)=>{
    // creating an updated contact list 
    let updatedContactList = {}
    contacts.forEach(item=>{
      if(item.email != requestee.email){
        updatedContactList[item.email] = item
      }
    })
    if(accepted)
      updatedContactList[requestee.email] = {active:false, name:requestee.name, request:false};


    //uploading the data to the firebase
    const que = query (collection(db,"Users"), where("id",'==', auth.currentUser.uid));
    const currentDoc = await getDocs(que)
    currentDoc.forEach(async(doc)=>{
      await updateDoc(doc.ref,{"contacts":updatedContactList})
    })

  }

  //updates the contact list on the user side
  const handleRequsteeSide = async(requestee, deleteContact)=>{

    //getting requestee contact list
    const q  =query(collection(db,"Users"), where("email","==", requestee.email));
    const docs = await getDocs(q);

    let contactList;
    docs.forEach(doc=>{
      contactList = doc.data().contacts
    })

    //if deleting the contact
    if(deleteContact){
      delete contactList[auth.currentUser.email]
    }
    //if adding the contact
    else{
      //updating the contact list
      const newItem = {
        name : auth.currentUser.displayName,
        active: false,
        request: false
      }
      let key =auth.currentUser.email
      contactList[key] = newItem
    }
    //uploading the change to firebase
    docs.forEach(async(doc)=>{
      await updateDoc(doc.ref,{contacts:contactList})
    })

  }

  // hadles the accepting or denying 
  const handleRequest =  async(toAccept, requestee)=>{
    if(toAccept){
      //update the contact list on the user side
      await handleUserSide(requestee, true);
      await handleRequsteeSide(requestee, false);

      //bringing up a toast
      ToastAndroid.showWithGravity(
        'you accepted',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    else{
      //update the contact list on the user side
      handleUserSide(requestee, false);

      //bringing up a toast
      ToastAndroid.showWithGravity(
        'you denied',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }

  //sends arequest to a potential contact
  const addContact = async()=>{
    
    //if sending to themself
    if(email == auth.currentUser.email){
      alert("cannot send a request to yourself");
      return;
    }

    //if the email is already a contact
    if(contacts.some(item=>item.email==email)){
      alert("requested email is alreay in your contacts");
      return;
    }

    const found = await search()
    if(found){
      // getting the contacts information
      const q = query(collection(db,"Users"), where("email","==",email));
      const docs = await getDocs(q);

      // adding the request to the contacts
      docs.forEach(async(doc)=>{
        const contactList = doc.data().contacts;
        //if there us already a request from you
        if(email in contactList)
          return;
        
        // adding the request
        const contactRequest = {
          name:auth.currentUser.displayName,
          active: false,
          request:true
         }
        
        let key = auth.currentUser.email 

        //updating the firebase doc
        let updatedContactList = {...contactList}
        updatedContactList[key] = contactRequest

        await updateDoc(doc.ref, {contacts:updatedContactList})
        alert("invite has been sent")
      })
      //reseting the variables
      setEmail("")
      setVisible(false);
    }

    else
      alert('given email is not registered')
  }

  // finds whether or not the email exists for an active user
  const search =async()=>{
    let exists = await fetchSignInMethodsForEmail(auth, email).then(data=>{
      return data.length===0?false: true;
    }
    ).catch(error=>{return false})
    return exists
  }

  //loading the contact list with a listener
  useEffect (()=>{
    const ref = collection(db, 'Users');
    const que = query (ref, where("id",'==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(que, querySnapshot => {
      querySnapshot.docs.forEach(doc=>{
        let contactList = doc.data().contacts
        let tempArray = [];
        for(const contact in contactList){
          tempArray.push({
            name:contactList[contact].name,
            email:contact,
            active:contactList[contact].active,
            request:contactList[contact].request
          }) 

        }
        setContacts(tempArray)
      })
    });
    
    return ()=>unsubscribe()
    },[])

  return (
    <BackgroundImage source={image} style = {styles.page}>
    <View style = {styles.pageContent}>
      {/*----------------- the adding area ----------------*/}
      {/* the pop up for adding */}
      <Modal visible={visible} animationType="slide"
                               >
        <ImageBackground source={require('../../assets/pool4.png')} style={styles.page} >
          <View style={styles.modalContent}>
        <TouchableOpacity onPress={()=>{setVisible(false)}}>
          <Icon name="ios-arrow-back" size={30} color="black"></Icon>
        </TouchableOpacity>
        <View style={styles.c}>
        <TextInput
                  style = {styles.box}
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  autoCapitalize="none"
                  autoCorrect = {false}
        />
        <TouchableOpacity onPress={addContact} style={styles.contactsItemButton}>
          <Text>Send Invite</Text>
        </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />

        {/* the request area */}
        {contacts.filter(item=>item.request==true).length>0?
        <FlatList
          data={contacts.filter(item=>item.request==true)}
          keyExtractor = {item=> item.email}
          renderItem = {(data)=><RequestItem user={data.item}/>}
        />:
        <Text style={{fontWeight: '400', fontSize: 20}}>There are currently no requests</Text>
        }
        </View>
</ImageBackground>
      </Modal>

      {/* the adding button */}
      <View>
        <TouchableOpacity onPress={()=>{setVisible(true)}} style={{margin: 6}}>
          <Icon name="md-person-add" size={30}/>
        </TouchableOpacity>
        {contacts.filter(item=>item.request==true).length>0?
        <View style={styles.redDot}/>
        :
        null}
      </View>

      {/* --------------------list area------------------ */}
      {/* the contact list */}
      {contacts.filter(item=>item.request==false).length>0?
      <FlatList
        data={contacts.filter(item=>item.request==false)}
        keyExtractor = {item=> item.email}
        renderItem = {(data)=><Contact user={data.item}/>}
      />:
      <Text>you currently have no contact - try clicking the add button to add a contact</Text>
      }
    </View>
    </BackgroundImage>
  )
}

export default Contacts

const styles = StyleSheet.create({
  redDot:{
    position:"absolute",
    left:20,
    height:10,
    width: 10,
    borderRadius:25,
    backgroundColor:"red",
    padding: 3,
  },
  activeButton:{
    width:50,
    height:50,
    backgroundColor: "blue"
  },
  page: {
    minHeight: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    maxWidth: '100%',
  },
  pageContent: {
    minHeight: '85%',
    maxHeight: '85%',
    minWidth: '85%',
    maxWidth: '85%',
    alignSelf: 'center',
    marginVertical: 40,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
  },
  contactsItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    margin: 5,
    padding: 7,
  },
  contactsItemText: {
    fontSize: 20,
    fontWeight: '500',

  },
  contactsItemButton: {
    alignSelf: 'center',
    backgroundColor: `#008b8b`,
    borderRadius: 30,
    width: '30%',
    
  },
  contactsItemButtonText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  module: {
    minHeight: '100%',
  },
  modalContent: {
    minHeight: '85%',
    maxHeight: '85%',
    minWidth: '85%',
    maxWidth: '85%',
    alignSelf: 'center',
    marginVertical: 40,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
  },
  page: {
    minHeight: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    maxWidth: '100%',
  },
  box: {
    backgroundColor: `#ffe4c4`,
    fontSize: 20,
    borderWidth: 2,
    margin: 10,
    padding: 3,
    paddingLeft: 3,
    borderRadius: 10,
},
a: {
  // backgroundColor: `#5f9ea0`,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: 30,
  // opacity: '50%',
  Transparent: '50%',
  padding: 9,
  margin:30,
  height: '30%',
  width: '80%',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  
},
c: {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: 30,
  padding: 3,
  margin:1,
  height: '30%',
  width: '90%',
  alignSelf: 'center',
  
},
})