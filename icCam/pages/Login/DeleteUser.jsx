import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import {auth, db} from '../../firebase'
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'

const DeleteUser = () => {

    // getting the email list of the contacts
    const getContactList = async()=>{
        const q = query(collection(db, "Users"), where("id", "==", auth.currentUser.uid));
        const docs = await getDocs(q);

        const contactList = []
        docs.docs.forEach(doc=>{
           const contacts =  doc.data()["contacts"];

           for(let contact in contacts){
                contactList.push(contact);
           }
        })

        return contactList;
    }

    // removing the user from all contacts
    const removeFromContacts = async()=>{
        const contacts = await getContactList();

        if(contacts.length == 0)
            return
        
        const q = query(collection(db,"Users"), where("email", "in", contacts));
        const contactList = await getDocs(q);

        contactList.docs.forEach(async doc=>{
           const contactContacts = doc.data()["contacts"];
           delete contactContacts[auth.currentUser.email]
           
           await updateDoc(doc.ref, {"contacts" : contactContacts})
        })

    }

    const deleteFromFirestore = async()=>{
        const q = query(collection(db, "Users"), where("id", "==", auth.currentUser.uid));
        const user = await getDocs(q);

        user.docs.forEach(async doc=>{
            await deleteDoc(doc.ref);
        })

        await deleteDoc(doc(db,"LiveFeed",auth.currentUser.email));
    }

    const deleteUserFromFirebase = async()=>{
        removeFromContacts();

       await deleteFromFirestore();

        deleteUser(auth.currentUser).then(
            alert("Your user has been deleted")
        )

    }


    const areYouSure = ()=>{
        Alert.alert(
            "delete?",
            "are you sure you want to delete your account",
            [
              {
                text: "cancle",
                onPress: () => {return},
              },

              {
                text: "delete",
                onPress: async () => {
                   await deleteUserFromFirebase();
                },
              },

            ],
          );
    }
    return (
    <View>
       <TouchableOpacity onPress={areYouSure}>
        <Text>Delete User</Text>
       </TouchableOpacity>
    </View>
    )
}

export default DeleteUser