import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase'

const ForgotPassword = () => {
    const [email, setEmail] =useState("")

    const sendEmail = async()=>{
        if(email.trim()==""){
            alert("Fill Out Email To Send The Mail")
            return
        }
        try{
            signInWithEmailAndPassword(auth, email, "")
        }
        catch(e){
            alert(e)
        }
        await sendPasswordResetEmail(auth, auth.currentUser.email)
        alert("check your email to reset your password")
    }
  return (
    <View>
      <Text>ForgotPassword</Text>
      <View>
      <TextInput
                style = {styles.box}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect = {false}
                />
        <TouchableOpacity onPress={sendEmail}>
            <Text>sendEmail</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
    box: {
        backgroundColor: `#7fffd4`,
        fontSize: 20,
        borderWidth: 2,
        margin: 10,
        padding: 1,
        paddingLeft: 3,
    },
})