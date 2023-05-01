import { StyleSheet, Text, TouchableOpacity, View ,Image, ImageBackground, Animated, SafeAreaView, Modal, Dimensions } from 'react-native'
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
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  }
  const closeModal = () => {
    setModalVisible(false);
  }
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
  <ImageBackground source={require('../../assets/pool3.png')} style={styles.image}>
    <View style={{minHeight: '100%'}}>
      {/* <SafeAreaView style = {styles.SafeAreaViewStyle}> */}
      {/* ============================================================================================================================== */}
        <View style={styles.titleView}>
          <Text style = {styles.title}>hello there {auth.currentUser.displayName}</Text>
          <View style = {styles.logoView}>
            <Image source={require('../../assets/a.png')}
                style = {styles.logologo}/>
          </View>
        </View>
        {/* ================================================================================================================================= */}
        {/* --------------------------------------------------------------------------------------------------------------------------- */}
         {/* <ImageBackground source={image} style={styles.pool}> */}
         {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
        <View style={styles.newBox}>
          <FadeInView duration={1000}> 
            <View style = {styles.buttonBox}>
              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30}}>
                <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.button}>
                  {/* <Text style={styles.buttonText}>Camera</Text> */}
                  <Icon name="video-camera" size={150} color="#f4a460" style={{borderColor: `#000000`,borderRadius: 5, shadowRadius:  3, shadowColor: `#000000`, shadowOpacity: 0.5, shadowOffset: "left" }} />
                </TouchableOpacity>
              </View>
                    {/* <View> */}
                        {/* <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style={styles.button}> */}
                          {/* <Text style={styles.buttonText}>Contacts</Text> */}
                          {/* <Icon name="address-book" size={90} color="#900" /> */}
                        {/* </TouchableOpacity> */}
                    {/* </View>  */}
            </View>       
          </FadeInView>
        </View>
        {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
        {/* (((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))) */}
         <View style = {{maxHeight:'10%',minHeight: '10%', padding: 10,alignItems: 'center' ,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, alignSelf: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style={styles.button}>
                        <Text style={styles.logoutText}>Contacts</Text>
                        {/* <Icon name="address-book" size={90} color="#900" /> */}
                      </TouchableOpacity>
                      <Text style = {styles.logoutText}>|</Text>
                      <TouchableOpacity onPress={logOut} style = {styles.FuncButton}>
                      <Text style={styles.logoutText}>Log Out</Text>
                      </TouchableOpacity>
                      <Text style = {styles.logoutText}>|</Text>
                      <TouchableOpacity  style = {styles.FuncButton} onPress={toggleModal}>
                      <Text style={styles.logoutText}>How It Works</Text>
                      </TouchableOpacity>
                      <Modal visible={modalVisible} animationType="slide"
                              style={styles.modalContent}>
                                <ImageBackground source={image} style = {styles.page}>
                        <View style={styles.modalContent}>
                          <TouchableOpacity style={styles.contactsItemButton}   onPress={closeModal}>
                            <Text style={styles.closeButton}>Close Modal</Text>
                          </TouchableOpacity>
                        </View>
                        </ImageBackground>
                      </Modal>


         </View>
         {/* (((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))) */}
          {/* </ImageBackground> */}
             
             {/* ------------------------------------------------------------------------------------------------------------------------------------ */}
                {/* <View style = {styles.logOutView}> */}
                  {/* <Text style = {styles.logoutText}>log out view 4r</Text> */}
                  {/* <View>
                    <TouchableOpacity onPress={logOut} style = {styles.FuncButton}>
                      <Text style={styles.logoutText}>Log out</Text>
                      </TouchableOpacity>
                  </View> */}
                {/* </View> */}
            {/* <View style={styles.container}> */}
              {/* <Animated.View style={[styles.square, animation.getLayout()]} /> */}
              
          {/* </View> */}
      {/* </SafeAreaView> */} 
      </View>
    </ImageBackground>
  )
}

export default Home

const styles = StyleSheet.create({
  contactsItemButton: {
    alignSelf: 'center',
    backgroundColor: `#008b8b`,
    borderRadius: 30,
    width: '30%',
    
  },
  page: {
    minHeight: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    maxWidth: '100%',
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
  },
  pool: {
    width: '100%',
    height: '80%',
  },
  SafeAreaViewStyle: {
    backgroundColor: 'rgba(0, 139, 139, 0.6)',
    // borderColor: `#ff0000`,
    borderWidth: 5,
    maxHeight: '100%',
    minHeight: '100%',
    maxWidth: '100%',
    minHeight: '100%',
  },
  titleView: {
    // borderWidth: 10,
    // backgroundColor: 'rgba(0, 139, 139, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    maxHeight: '30%',
    minHeight: '30%',
  },
  logoView: {
    margin: 50,
    // backgroundColor: `#2f4f4f`,
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
  buttonBox: {
    // margin: 10,
    // backgroundColor: `#6495ed`,
    // borderRadius: 75,
    // // borderColor: `#7fff00`,
    // borderWidth: 10,
    paddingTop: 20
  },
  imageNew: {
    // borderRadius: 50,
    // margin: 10,
    // height: 20,
    // maxHeight: '80%',
    // minHeight: '80%',
    // maxWidth: '80%',
    // minWidth: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  FuncButton: {
    // borderWidth: 2,
    // alignSelf: 'center',
    // maxWidth: '90%',
    // paddingHorizontal: 8,
    // paddingVertical: 6,
    // // borderRadius: 100,
    // backgroundColor: 'oldlace',
    // marginHorizontal: '1%',
    // marginBottom: 6,
    // minWidth: '40%',
    // textAlign: 'center',
    // backgroundColor: `#deb887`,
  },
  logOutView: {
    backgroundColor: 'rgba(0, 139, 139, 0.3)',
  },
  logoutText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2, 
    textShadowColor: `#cd853f`,
  
  },
  
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // square: {
  //   width: 100,
  //   height: 100,
  //   backgroundColor: 'red',
  //   backgroundColor: `#2f4f4f`,
  // },
 
  newBox: {
    // borderRadius: 75,
    justifyContent: 'center', 
    alignItems: 'center', 
    // alignSelf: 'center',
    // height: '40%' , 
    // backgroundColor: `#d2691e`,
    maxHeight: '60%',
    minHeight: '60%',
    // marginTop: 10 , 
    // width: '80%' ,
    // borderWidth: 5,
  },
  // logo: {
  //   fontWeight: 'bold',
  //   color: '#b8860b',
  //   shadowColor: '#cd5c5c',
  //   fontSize: 60,
  //   alignSelf: 'center',
  //   borderCurve: '#cd5c5c',
  //   background: {
  //     position: 'absolute',
  //     top: 1,
  //     bottom: 1,
  //     left: 1,
  //     right: 1,
  //     backgroundColor: `#000000`,
  //     borderRadius: Dimensions.get('window').height / 2,
  //     overflow: 'hidden'
  //   }
  // },
  // logologo: {
  //   // height: '90%',
  //   // width: '50%',
  //   // alignSelf: 'center',
  //   background: {
  //     position: 'absolute',
  //     top: 1,
  //     bottom: 1,
  //     left: 1,
  //     right: 1,
  //     backgroundColor: `#000000`,
  //     borderRadius: Dimensions.get('window').height / 9,
  //     overflow: 'hidden'
  //   },
  //   // backgroundColor: `#000000`,
  // },
  
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 30,
  },
  button: {
    // borderWidth: 2,
    // height: "60%",
    // alignSelf: 'center',
    // alignItems: 'center',
    // maxWidth: '90%',
    // paddingHorizontal: 8,
    // paddingVertical: 6,
    // borderRadius: 40,
    // // backgroundColor: 'oldlace',
    // marginHorizontal: '1%',
    // // marginBottom: 6,
    // // margin: 10,
    // minWidth: '88%',
    // textAlign: 'center',
    // backgroundColor: `#ffe4c4`,
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
  },
  
})