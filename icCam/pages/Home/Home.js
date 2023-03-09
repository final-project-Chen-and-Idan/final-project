import { StyleSheet, Text, TouchableOpacity, View ,Image, ImageBackground} from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import React from 'react'
import {Camera} from '../Camera/Camera'
import { NavigationContainer, useNavigation } from '@react-navigation/native'


const Home = () => {

  const navigation = useNavigation();

  const image = {uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQld43FLoaOoKEDcHtOuns32h7Pt3DR-Mc0wROQYQi_t1bsHPk3BMYVDT5S7babFkg-5DQ&usqp=CAU"}

  const logOut = async()=>{
    try{
      await signOut(auth)
    }
    catch(error){
      alert(error)
    }
  }

  return (
    <ImageBackground source={image} style={styles.image}>
      <View>
            <Text style = {styles.title}>hello there  {auth.currentUser.email}</Text>
            <View style={styles.box}>
                <View>
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
          
          </View>
    </ImageBackground>
   
   
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
    backgroundColor: `#daa520`,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
  box: {
    textAlign: 'center',
    justifyContent: 'center',
    //backgroundColor: `#2f4f4f`,
    height: '80%'
  },
  image: {
    height: '100%'
  }
})