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
  const [model, setModel] = useState();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front)
  const [prediction, setPrediction] = useState();
  
  useEffect(()=>{
    async function prepare(){
      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();
      
      //loading the model 
      const modelJson = require('../../tfjs/model.json');
      const modelWeights1 = require('../../tfjs/group1-shard1of4.bin')
      const modelWeights2 = require('../../tfjs/group1-shard2of4.bin')
      const modelWeights3 = require('../../tfjs/group1-shard3of4.bin')
      const modelWeights4 = require('../../tfjs/group1-shard4of4.bin')
      

      const data = bundleResourceIO(modelJson,[
        modelWeights1,
        modelWeights2,
        modelWeights3,
        modelWeights4,
      ])
      console.log("somthing")
      //loading the model
      const model =await tf.loadGraphModel(data)
      
      setModel(model);
      // saying that the model is ready 
      setModelReady(true);
    }

    prepare();
  },[])


  const handleCameraStream = async(images,updatePreview,gl)=>{
    const loop = async()=>{
      const imageTensor = images.next().value.shape

      
      try{
      const prediction = await model.predict(imageTensor);
      setPrediction(prediction);
      console.log(prediction)
      tf.dispose([imageTensor]);

      updatePreview();
      gl.endFrameEXP();

      }
       catch(e){
        console.log("errpr")
       } 
    
    }
    loop();
    
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
      <View>
        <TensorCamera
          ref={cameraRef}
          autorender={false}
          type={cameraType}
          style={styles.camera}
          // tensor props
          resizeWidth={640}
          resizeHeight={640}
          resizeDepth={3}
          rotation={0}
          onReady={handleCameraStream}
        />
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
  //       <TouchableOpacity 
  //       onPress={()=>{
  //         cameraDirection?setCameraDirection(false):
  //                         setCameraDirection(true)}}>
  //                         <View style = {styles.iconView}>
  //                           <Icon style={styles.iconButton} name="md-camera-reverse" size={20}/>
  //                         </View>
  //       </TouchableOpacity>
  //     </View>
  //     :
  //     <View>
  //       <Text>no access</Text>
  //       <TouchableOpacity onPress={startCamera}>
  //         <Text>get permission</Text>
  //       </TouchableOpacity>
  //     </View>
  //   }
  //   </>
  // )
}

export default MyCamera

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
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
        // height: '5%'
        backgroundColor: `#daa520`,
        borderRadius: 100,
        height: 40,
        width: 40,


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