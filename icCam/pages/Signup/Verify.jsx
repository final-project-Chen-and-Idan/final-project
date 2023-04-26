import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import Icon from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context'


const Verify = () => {
    const [page, setPage] = useState(1)
    const[name , setName] = useState('')
    const [phone, setPhone] =useState('')

    // seding the verifying email
    const verify = (user)=>{
        sendEmailVerification(user).then(alert("verification email has been sent"))
    }

    const verified = async()=>{
        await auth.currentUser.reload()
        if(!auth.currentUser.emailVerified)
            alert("email has not been verified")
        else{
          addDoc(collection(db,'Users'),{
            id:auth.currentUser.uid,
            email:auth.currentUser.email,
            contacts:{}
          });
          auth.signOut()
        }
    }

    const next = async()=>{
        if(name.trim()==""){
          alert("name is empty")
          return
        }
        await updateProfile(auth.currentUser,{
          displayName:name,
          // phoneNumber:phone
        })
        verify(auth.currentUser);
        setPage(2)
    }
  if(page ===1)
    return(
      <SafeAreaView>
        <View style = {styles.a}>
        <Text style = {styles.title}>Signup</Text>
        <TextInput
                  style = {styles.box}
                  placeholder="Name"
                  onChangeText={(name) => setName(name)}
                  autoCapitalize="none"
                  autoCorrect = {false}
                  />
        <TouchableOpacity
                style = {styles.button}
                onPress={next}>
                <Text style = {styles.buttonText}>next</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  else
    return (
      <SafeAreaView>
          <TouchableOpacity onPress={()=>auth.signOut()}>
            <Icon name="x" size={30}/>
          </TouchableOpacity>
          <View style={styles.box}>
              <Text style = {{fontSize: 30,}}>please verify your email</Text>
              <TouchableOpacity onPress={()=>verify(auth.currentUser)}>
                  <View >
                  <Text>if link was not sent press here to Verify</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={verified}>
                  <Text>Email has Been verified</Text>
              </TouchableOpacity>
          </View>
      </SafeAreaView>
  )
}

export default Verify

// const styles = StyleSheet.create({
//     title: {
//         //fontSize: 10,
//         fontWeight: 'bold',
//         fontSize: 20,
//       }
//          ,
//       button: {
//         borderWidth: 2,
//         alignSelf: 'center',
//         width: '40%',
//         paddingHorizontal: 8,
//         paddingVertical: 6,
//         borderRadius: 50,
//         backgroundColor: 'oldlace',
//         marginHorizontal: '1%',
//         marginBottom: 6,
//         minWidth: '48%',
//         textAlign: 'center',
//         backgroundColor: `#daa520`,
//       },
//       buttonText: {
//         textAlign: 'center',
//         justifyContent: 'center',
//         fontWeight: 'bold',
//         fontSize: 25,
//       },
//       box: {
//         textAlign: 'center',
//         justifyContent: 'center',
//         //backgroundColor: `#2f4f4f`,
//         height: '80%'
//       },
// })
const styles = StyleSheet.create({
  a: {
    backgroundColor: `#5f9ea0`,
    padding: 2,
    margin:30,
    height: '70%'
  },
  box: {
    backgroundColor: `#7fffd4`,
    fontSize: 20,
    borderWidth: 2,
    margin: 10,
    padding: 1,
    paddingLeft: 3,
},
button: {
    borderWidth: 2,
    alignSelf: 'center',
    width: '40%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'oldlace',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: `#daa520`,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  }
})