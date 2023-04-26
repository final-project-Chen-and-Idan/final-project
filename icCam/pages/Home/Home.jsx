import { StyleSheet, Text, TouchableOpacity, View ,Image, ImageBackground, Animated, SafeAreaView} from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
// import React from 'react'
import React, { useEffect, useRef ,Component, useState } from 'react';
import {Camera} from '../Camera/Camera'
import { Notifications} from '../Notifications/Notifications'
// import {logo} from '../assets'
import { NavigationContainer, useNavigation } from '@react-navigation/native'


const Home = () => {
  const [animation] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const moveSquare = () => {
    Animated.timing(animation, {
      toValue: { x: 200, y: 200 },
      duration: 1000,
      useNativeDriver: false, // this property must be set to false when using LayoutAnimation on Android
    }).start();
  };
  const navigation = useNavigation();

  const image = {uri: "https://img.freepik.com/free-vector/scene-swimming-pool-with_1308-37683.jpg"}


  
  const logOut = async()=>{
    try{
      await signOut(auth)
    }
    catch(error){
      alert(error)
    }
  }

  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: props.duration || 1000,
          useNativeDriver: true
        }
      ).start();
    }, [fadeAnim, props.duration]);
  
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          ...props.style
        }}
      >
        {props.children}
      </Animated.View>
    );
  };
  
  
  
  return (
    // <ImageBackground source={image} style={styles.image}>
      <SafeAreaView>
            <Text style = {styles.title}>hello there  {auth.currentUser.displayName}</Text>
            {/* <Text style={styles.logo}>IC-CAM</Text> */}
            <View style = {styles.logoView}>
            <Image source={require('../../assets/a.png')}
            style = {styles.logologo}/>
            </View>
           
            {/* <View style={styles.box}> */}
                {/* <View>
                  <TouchableOpacity onPress={logOut} style = {styles.button}>
                    <Text style={styles.buttonText}>signOut</Text>
                    </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.button}>
                    <Text style={styles.buttonText}>camera</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity  onPress={() => {navigation.navigate('Notifications')}} style={styles.button}>
                    <Text style={styles.buttonText}>alarms</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style={styles.button}>
                    <Text style={styles.buttonText}>Contacts</Text>
                  </TouchableOpacity>
                </View> */}
            {/* </View> */}
            <View style={styles.newBox}>
                <FadeInView duration={10000}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
                      Welcome to my app!
                    </Text>
                    <View>
                    <TouchableOpacity onPress={logOut} style = {styles.button}>
                      <Text style={styles.buttonText}>signOut</Text>
                      </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.button}>
                      <Text style={styles.buttonText}>camera</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity  onPress={() => {navigation.navigate('Notifications')}} style={styles.button}>
                      <Text style={styles.buttonText}>alarms</Text>
                    </TouchableOpacity>
                  </View> 
                  <View>
                  <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style={styles.button}>
                    <Text style={styles.buttonText}>Contacts</Text>
                  </TouchableOpacity>
                </View>
                </FadeInView>
            </View>
            <View style={styles.container}>
              <Animated.View style={[styles.square, animation.getLayout()]} />
              <TouchableOpacity onPress={moveSquare}>
                <Text style={styles.button}>Move square</Text>
              </TouchableOpacity>
          </View>
          </SafeAreaView>
    // </ImageBackground>
   
   
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    backgroundColor: `#2f4f4f`,
  },
  button: {
    marginTop: 20,
    color: 'blue',
  },
  newBox: {
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '60%' , 
    marginTop: 100 , 
    width: '80%' 
  },
  logo: {
    fontWeight: 'bold',
    color: '#b8860b',
    shadowColor: '#cd5c5c',
    fontSize: 60,
    alignSelf: 'center',
    borderCurve: '#cd5c5c',
  },
  logologo: {
    // height: '90%',
    // width: '50%',
    alignSelf: 'center',
  },
  logoView: {
    // margin: 50,
    // backgroundColor: `#2f4f4f`,

  },
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 30,
  }
     ,
  // button: {
  //   borderWidth: 2,
  //   alignSelf: 'center',
  //   width: '40%',
  //   paddingHorizontal: 8,
  //   paddingVertical: 6,
  //   borderRadius: 50,
  //   backgroundColor: 'oldlace',
  //   marginHorizontal: '1%',
  //   marginBottom: 6,
  //   minWidth: '48%',
  //   textAlign: 'center',
  //   backgroundColor: `#daa520`,
  // },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
  box: {
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: `#8b0000`,
    height: '10%',
    margin: 20,
  },
  image: {
    height: '100%'
  }
})