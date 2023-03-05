import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import React from 'react'

const Home = () => {

  const logOut = async()=>{
    try{
      await signOut(auth)
    }
    catch(error){
      alert(error)
    }
  }

  return (
    <View>
      <Text>hello there {auth.currentUser.email}</Text>
      <TouchableOpacity onPress={logOut}>
        <Text>signOut</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})