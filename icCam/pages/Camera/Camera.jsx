import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState, useRef} from 'react';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  bundleResourceIO,
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native"
import * as tf from "@tensorflow/tfjs"

const TensorCamera = cameraWithTensors(Camera);


const MyCamera = () => {
  const cameraRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const [permission, setPermission] = useState(false);
  const [model, setModel] = useState();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front)
  const [prediction, setPrediction] = useState();
  const amountRef = useRef(0)
  
  const prepare = async()=>{
    // Camera permission.
    const {status} = await Camera.requestCameraPermissionsAsync()
    // saying the camera is active
    if(status === 'granted'){
      setPermission(true)
    }
    // access was not given
    else{
      alert("you denied access")
      setPermission(false)
      return
    }

    // Wait for tfjs to initialize the backend.
    await tf.ready();
    
    //loading the model 
    const modelJson = require('../../assets/tfjs/people/model.json');
    const modelWeights1 = require('../../assets/tfjs/people/group1-shard1of4.bin')
    const modelWeights2 = require('../../assets/tfjs/people/group1-shard2of4.bin')
    const modelWeights3 = require('../../assets/tfjs/people/group1-shard3of4.bin')
    const modelWeights4 = require('../../assets/tfjs/people/group1-shard4of4.bin')
    // const modelJson = require('../../assets/tfjs/pool/model.json')
    // const modelWeights1 = require('../../assets/tfjs/pool/group1-shard1of27.bin')
    // const modelWeights2 = require('../../assets/tfjs/pool/group1-shard2of27.bin')
    // const modelWeights3 = require('../../assets/tfjs/pool/group1-shard3of27.bin')
    // const modelWeights4 = require('../../assets/tfjs/pool/group1-shard4of27.bin')
    // const modelWeights5 = require('../../assets/tfjs/pool/group1-shard5of27.bin')
    // const modelWeights6 = require('../../assets/tfjs/pool/group1-shard6of27.bin')
    // const modelWeights7 = require('../../assets/tfjs/pool/group1-shard7of27.bin')
    // const modelWeights8 = require('../../assets/tfjs/pool/group1-shard8of27.bin')
    // const modelWeights9 = require('../../assets/tfjs/pool/group1-shard9of27.bin')
    // const modelWeights10 = require('../../assets/tfjs/pool/group1-shard10of27.bin')
    // const modelWeights11 = require('../../assets/tfjs/pool/group1-shard11of27.bin')
    // const modelWeights12 = require('../../assets/tfjs/pool/group1-shard12of27.bin')
    // const modelWeights13 = require('../../assets/tfjs/pool/group1-shard13of27.bin')
    // const modelWeights14 = require('../../assets/tfjs/pool/group1-shard14of27.bin')
    // const modelWeights15 = require('../../assets/tfjs/pool/group1-shard15of27.bin')
    // const modelWeights16 = require('../../assets/tfjs/pool/group1-shard16of27.bin')
    // const modelWeights17 = require('../../assets/tfjs/pool/group1-shard17of27.bin')
    // const modelWeights18 = require('../../assets/tfjs/pool/group1-shard18of27.bin')
    // const modelWeights19 = require('../../assets/tfjs/pool/group1-shard19of27.bin')
    // const modelWeights20 = require('../../assets/tfjs/pool/group1-shard20of27.bin')
    // const modelWeights21 = require('../../assets/tfjs/pool/group1-shard21of27.bin')
    // const modelWeights22 = require('../../assets/tfjs/pool/group1-shard22of27.bin')
    // const modelWeights23 = require('../../assets/tfjs/pool/group1-shard23of27.bin')
    // const modelWeights24 = require('../../assets/tfjs/pool/group1-shard24of27.bin')
    // const modelWeights25 = require('../../assets/tfjs/pool/group1-shard25of27.bin')
    // const modelWeights26 = require('../../assets/tfjs/pool/group1-shard26of27.bin')
    // const modelWeights27 = require('../../assets/tfjs/pool/group1-shard27of27.bin')
        

    const data = bundleResourceIO(modelJson,[
      modelWeights1,
      modelWeights2,
      modelWeights3,
      modelWeights4,
      // modelWeights5,
      // modelWeights6,
      // modelWeights7,
      // modelWeights8,
      // modelWeights9,
      // modelWeights10,
      // modelWeights11,
      // modelWeights12,
      // modelWeights13,
      // modelWeights14,
      // modelWeights15,
      // modelWeights16,
      // modelWeights17,
      // modelWeights18,
      // modelWeights19,
      // modelWeights20,
      // modelWeights21,
      // modelWeights22,
      // modelWeights23,
      // modelWeights24,
      // modelWeights25,
      // modelWeights26,
      // modelWeights27,
    ])
    console.log("loading the model")
    //loading the model
    const model =await tf.loadGraphModel(data)
    console.log("finished loading the model")
    setModel(model);
    // saying that the model is ready 
    setModelReady(true);
  }

  useEffect(()=>{
    prepare();
  },[])


  const handleCameraStream = async(images)=>{
    const loop = async()=>{
      amountRef.current++;
      if(amountRef.current == 5){
        amountRef.current=0;
        loop()
      }
      
      let imageTensor = images.next().value
      imageTensor = (imageTensor.reshape([1, 640, 640, 3])).cast('float32')
      
      try{
        // console.log(tf.browser.fromPixels(images))
        let prediction = await model.execute(imageTensor);
        prediction = await prediction
        setPrediction(prediction);
        tf.dispose([imageTensor]);
      }
       catch(e){
        console.log("errpr")
        console.log(e)
       } 
      }
      loop();
    
  }
  // Run object detection on captured image
  // const handleCapture = async () => {
  //   if (cameraRef.current) {
  //     const photo = await cameraRef.current.takePictureAsync();
  //     const tensor = tf.browser.fromPixels(photo.uri);
  //     const result = await model.executeAsync(tensor);
  //     console.log(result);
  //   }
  //   handleCapture();
  // };


  if(!permission){
   return(
    <View>
      <Text>no access</Text>
      <TouchableOpacity onPress={prepare}>
        <Text>get permission</Text>
      </TouchableOpacity>
    </View>
    )
  }



  if(!modelReady){
    return(
      <>
        <View>
          <Text>Loading.....</Text>
        </View>
      </>
    )
  }
  return(
    <>    
      <View style={{...StyleSheet.absoluteFill,...styles.view}}>
        <TensorCamera
          ref={cameraRef}
          autorender={false}
          type={cameraType}
          style={{...styles.camera,...StyleSheet.absoluteFill}}
          // tensor props
          cameraTextureHeight={1200}
          cameraTextureWidth={1600}
          resizeWidth={640}
          resizeHeight={640}
          resizeDepth={3}
          rotation={0}
          onReady={handleCameraStream}
        />
        {/* <Camera
          style={StyleSheet.absoluteFill}
          type={cameraType}
          ref={cameraRef}
          onCameraReady={handleCapture}
        /> */}
        <TouchableOpacity 
        onPress={()=>{
          cameraType==Camera.Constants.Type.front?
          setCameraType(Camera.Constants.Type.back):
          setCameraType(Camera.Constants.Type.front)}}>
          <View style = {styles.iconView}>
            <Icon style={styles.iconButton} name="md-camera-reverse" size={40}/>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
  
  
  
  // const [cameraDirection, setCameraDirection] = useState(false)
  // const [activeCamera, setActiveCamera] = useState (false)
  // // activates the camera and asks for permission on the way
  // const startCamera = async () => {
  //   // gets the permission
  //   const {status} = await Camera.requestCameraPermissionsAsync()
  //   // saying the camera is active
  //   if(status === 'granted'){
  //     setActiveCamera(true)
  //   }
  //   // access was not given
  //   else{
  //     alert("you denied access")
  //   }
  // }

  
  // // when screen loads activate the camera
  // useEffect(()=>{
  //   startCamera()
  // },[])
    
  // return (
  //   <>
  //   {activeCamera?
  //     <View>
  //       <Camera
  //       type={cameraDirection?"front": "back"}
  //       style={{width: "100%", height: 550}}
  //       />
        // <TouchableOpacity 
        // onPress={()=>{
        //   cameraDirection?setCameraDirection(false):
        //                   setCameraDirection(true)}}>
        //                   <View style = {styles.iconView}>
        //                     <Icon style={styles.iconButton} name="md-camera-reverse" size={20}/>
        //                   </View>
        // </TouchableOpacity>
  //     </View>
  //     :
      // <View>
      //   <Text>no access</Text>
      //   <TouchableOpacity onPress={startCamera}>
      //     <Text>get permission</Text>
      //   </TouchableOpacity>
      // </View>
  //   }
  //   </>
  // )
}

export default MyCamera

const styles = StyleSheet.create({
    camera: {
      zIndex: 1,
    },
    view:{
      justifyContent:'flex-end'
    },
    button: {
        borderWidth: 2,
        width: '40%',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 50,
        
        alignSelf: 'center',
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
      iconView: {
        alignSelf: 'center',
        bottom:30,
        backgroundColor: `#daa520`,
        borderRadius: 100,
        height: 60,
        width: 60,


      },
      iconButton: {
        // height: '80%',
        // backgroundColor: `#daa520`,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 9,
        height: '90%',
        // width: '90%'

      }
})