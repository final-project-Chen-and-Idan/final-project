import { StyleSheet, Text, TouchableOpacity, View ,Image, ImageBackground, Animated, SafeAreaView} from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
// import React from 'react'
import React, { useEffect, useRef ,Component, useState } from 'react';
import {Camera} from '../Camera/Camera'
import { Notifications} from '../Notifications/Notifications'
// import {logo} from '../assets'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';


const Home = () => {
  const [animation] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const moveSquare = () => {
    Animated.timing(animation, {
      toValue: { x: 200, y: 200 },
      duration: 1000000000,
      useNativeDriver: false, // this property must be set to false when using LayoutAnimation on Android
    }).start();
  };
  const navigation = useNavigation();

  const image = { uri: "https://img.freepik.com/free-vector/scene-swimming-pool-with_1308-37683.jpg" }


  
  const logOut = async()=>{
    try{
      await signOut(auth)
    }
    catch (error) {
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
          duration: props.duration || 90000,
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
      <SafeAreaView style = {styles.SafeAreaViewStyle}>
            <Text style = {styles.title}>hello there {auth.currentUser.displayName}</Text>
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
                <FadeInView duration={1000}>
                    {/* <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
                      Welcome to my app!
                    </Text> */}
                    {/* <View>
                    <TouchableOpacity onPress={logOut} style = {styles.button}>
                      <Text style={styles.buttonText}>Log out</Text>
                      </TouchableOpacity>
                  </View> */}
                  <View style = {styles.buttonBox}>
                      <View >
                        <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.button}>
                          {/* <Text style={styles.buttonText}>Camera</Text> */}
                          <Icon name="video-camera" size={50} color="#900" />
                        </TouchableOpacity>
                      </View>
                      <View>
                      <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style={styles.button}>
                        {/* <Text style={styles.buttonText}>Contacts</Text> */}
                        <Icon name="address-book" size={50} color="#900" />
                      </TouchableOpacity>
                    </View>
                </View>
                </FadeInView>
                
            </View>
            <View style = {styles.logOutView}>
                  {/* <Text style = {styles.logoutText}>log out view 4r</Text> */}
                  <View>
                    <TouchableOpacity onPress={logOut} style = {styles.FuncButton}>
                      <Text style={styles.logoutText}>Log out</Text>
                      </TouchableOpacity>
                  </View>
                </View>
            {/* <View style={styles.container}> */}
              {/* <Animated.View style={[styles.square, animation.getLayout()]} /> */}
              
          {/* </View> */}
          </SafeAreaView>
    // </ImageBackground>
   
   
  )
}

export default Home

const styles = StyleSheet.create({
  buttonBox: {
    padding: '20%',
  },
  SafeAreaViewStyle: {
    backgroundColor: `#5f9ea0`,
  },
  FuncButton: {
    borderWidth: 2,
    alignSelf: 'center',
    maxWidth: '90%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    // borderRadius: 100,
    backgroundColor: 'oldlace',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '40%',
    textAlign: 'center',
    backgroundColor: `#deb887`,
  },
  logOutView: {
    backgroundColor: `#2f4f4f`,
    alignSelf: 'center',
    alignItems: 'center',
    margin: 50,
    width: '90%',
    
  },
  logoutText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    shadowRadius: '30%',
    shadowColor : `#8a2be2`,
  
  },
  logoView: {
    marginTop: 50,
    backgroundColor: `#2f4f4f`,
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
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
 
  newBox: {
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center',
    height: '60%' , 
    backgroundColor: `#a52a2a`,
    // marginTop: 10 , 
    // width: '80%' 
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
  
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 30,
  }
  ,
  button: {
    borderWidth: 2,
    height: "50%",
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: '90%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 40,
    // backgroundColor: 'oldlace',
    marginHorizontal: '1%',
    // marginBottom: 6,
    margin: 10,
    minWidth: '88%',
    textAlign: 'center',
    backgroundColor: `#ffe4c4`,
  },
  buttonText: {
    textAlign: 'center',
    alignSelf: 'center',
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