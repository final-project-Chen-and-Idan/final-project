import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../../firebase'
import { sendEmailVerification } from 'firebase/auth'


const Verify = () => {

    // seding the verifying email
    const verify = (user)=>{
        sendEmailVerification(user).then(alert("verification email has been sent"))
    }

    const verified = async()=>{
        await auth.currentUser.reload()
        if(!auth.currentUser.emailVerified)
            alert("email has not been verified")
    }
  return (
    <View>
        <Text style = {{fontSize: 30,}}>please verify your email</Text>
        <TouchableOpacity onPress={()=>verify(auth.currentUser)}>
            <View style={{height:50, backgroundColor:"blue"}}>
            <Text>if link was not sent press here to Verify</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={verified}>
            <Text>Email has Been verified</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Verify

const styles = StyleSheet.create({})