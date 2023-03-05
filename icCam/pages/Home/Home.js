import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import React from 'react'
import {Camera} from '../Camera/Camera'
import { NavigationContainer, useNavigation } from '@react-navigation/native'

const Home = () => {

  const navigation = useNavigation();

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
      <View>
        <Text style = {styles.title}>hello there  {auth.currentUser.email}</Text>
        <TouchableOpacity onPress={logOut} style = {styles.button}>
          <Text style={styles.buttonText}>signOut</Text>
          </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.button}>
          <Text style={styles.buttonText}>go to camera</Text>
        </TouchableOpacity>
      </View>
    </View>
   
  )
}

export default Home

const styles = StyleSheet.create({
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
  }
     ,
  button: {
    borderWidth: 2,
    textAlign: 'center',
    justifyContent: 'center',
    width: '40%',
    borderRadius: 20,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
  }
})