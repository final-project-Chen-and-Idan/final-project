import { StyleSheet, Text, TouchableOpacity, View ,Image, ImageBackground, Animated, SafeAreaView, Modal, Dimensions } from 'react-native'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
// import React from 'react'
import React, { useEffect, useRef ,Component, useState } from 'react';
import {Camera} from '../Camera/Camera'
import Notifications from '../Notifications/Notifications'
// import {logo} from '../assets'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import DeleteUser from '../Login/DeleteUser';


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
    <View>
    <Notifications/>
    <DeleteUser></DeleteUser>
    <View style={{minHeight: '100%' , flex: 1, backgroundColor: 'cadetblue',}}>
      {/* <SafeAreaView style = {styles.SafeAreaViewStyle}> */}
        <View style={styles.titleView}>
          <View style={{flexDirection: 'row',backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
            <TouchableOpacity onPress={logOut} style = {styles.FuncButton}>
              <Text style={styles.logoutText}> Log Out </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style = {styles.title}>hello there {auth.currentUser.displayName} Welcome to:</Text> */}
          <View style = {styles.logoView}>
                <Image source={require('../../assets/a1.png')} style = {styles.logologo}/>
          </View>
        </View>
        <View style={styles.newBox}>
          <FadeInView duration={1000}> 
            <View style = {styles.buttonBox}>
              <View style = {styles.camButtonView}>
                <TouchableOpacity  onPress={() => {navigation.navigate('Camera')}} style={styles.camButton}>
                  {/* <Text style={styles.buttonText}>Camera</Text> */}
                  <Icon name="video-camera" size={150} color="darkslategrey" style={{borderColor: `#000000`,borderRadius: 5, shadowRadius:  3, shadowColor: `#000000`, shadowOpacity: 0.5}} />
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
         <View style = {{maxHeight:'10%',minHeight: '10%', padding: 10,alignItems: 'center' ,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, alignSelf: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <TouchableOpacity  onPress={() => {navigation.navigate('Contacts')}} style = {styles.FuncButton}>
                        <Text style={styles.logoutText}> Contacts</Text>
                        <Icon name="address-book" size={30} color="#d2691e" />
                      </TouchableOpacity>
                      <Text style = {styles.logoutText}>|</Text>
                      
                      {/* <Text style = {styles.logoutText}>|</Text> */}
                      <TouchableOpacity  style = {styles.FuncButton} onPress={toggleModal}>
                      <Text style={styles.logoutText}>How It Works </Text>
                      </TouchableOpacity>
                      <Modal visible={modalVisible} animationType="slide">
                                {/* <ImageBackground source={image} style = {styles.page}> */}
                        <View style={styles.all}>
                          <View style={styles.modalContent}>
                            <Text style = {styles.title}>How It Works:</Text>
                            <Text style={styles.text}>
                       

הבעיה: טביעת ילדים בבריכות ביתיות - כולנו מכירים את הסיפורים בתקשורת.
מקור הבעיה: חוסר תשומת לב של המבוגר האחראי והשגחה לא רציפה על הבריכה.
הפתרון שלנו: IC-CAM, אמצעי טכנולוגי להשגחה רציפה ויעילה על הבריכה המבוסס על למידה עמוקה בתחום עיבוד תמונה ומופעל באמצעות סמארטפון.
 

                            </Text>
                            <TouchableOpacity style={styles.button}   onPress={closeModal}>
                              <Text style={styles.buttonText}>Close Modal</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        {/* </ImageBackground> */}
                      </Modal>
         </View>
      </View>
      </View>
  )
}

export default Home

const styles = StyleSheet.create({
  all: {
    backgroundColor: 'cadetblue',
    height: '100%',
  } ,
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: 20,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2, 
    textShadowColor: 'darkslategrey ',
    color: 'darkslategrey ',
  },
  camButtonView: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 30, 
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: Platform.OS === 'android' ? 4 : 0,
  },
  camButton: {
    borderColor: "darkslategrey",
    borderRadius: 200,
    borderWidth: 10,
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {width: 0, height: 2},
},
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
    // borderRadius: [10, 20, 30, 40],
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
    maxHeight: '30%',
    minHeight: '30%',
    flex: 1,
    alignContent: 'flex-start',
    
    
  },
  logoView: {
    margin: 50,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'center',
    alignItems: 'center',
    width: '99%',
    // height: '50%',
    // padding: -100,
    // justifyContent: 'center'
  },
  FuncButton: {
   flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  logOutView: {
    backgroundColor: 'rgba(0, 139, 139, 0.3)',
  },
  logoutText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: 25,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2, 
    textShadowColor: 'darkslategrey ',
    color: 'darkslategrey ',
  
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
  
  logologo: {
    //  maxHeight: 500,
    //  width: 400,
    margin: 20,
    padding: 20,
    alignSelf: 'center',
    // maxHeight: '80%',
    // minHeight: '80%',
    maxWidth: '99%',
    minWidth: '90%',

    
  },
  
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 30,
    alignSelf: 'center',
    color: "darkslategrey",
  },
  button: {
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    width: '40%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'oldlace',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    backgroundColor: `#8fbc8f`,
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 15
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
  buttonBox: {
    flex: 2,
    // backgroundColor: `#ff8c00`,
    width: '100%'
  }
})