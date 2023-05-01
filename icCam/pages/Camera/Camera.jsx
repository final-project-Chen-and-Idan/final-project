import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState, useRef, createContext} from 'react';
import { Camera } from 'expo-camera';
import Canvas from 'react-native-canvas'
import Icon from 'react-native-vector-icons/Ionicons';
import {
  bundleResourceIO,
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native"
import * as tf from "@tensorflow/tfjs"
import * as cocossd from '@tensorflow-models/coco-ssd'
import * as posenet from '@tensorflow-models/posenet'
import MyNotifications from '../Notifications/Notifications';


const TensorCamera = cameraWithTensors(Camera);


export const alarmContext = createContext();

const MyCamera = () => {
  const cameraRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const [permission, setPermission] = useState(false);
  const [model, setModel] = useState();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [alarm, setAlarm] = useState(false);
  const amountRef = useRef(0)
  const context = useRef()
  const canvas = useRef()
  const {width, height} = Dimensions.get('window')
  
  const loadYoloV8 =async()=>{
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
    
    // loading the model
    console.log("model is loading")
    const model =await tf.loadGraphModel(data)
    console.log("model finished loading")

    //setting the model
    setModel(model);
  }

  //loads the cocossd model for object detection
  const loadDetectionModel = async()=>{
    //  loading the model
    console.log("loading the model")
    let model = await cocossd.load()
    console.log("finished loading the model")
    setModel(model);
  }

  //loads the pose detection model
  const loadPoseModel = async()=>{
     //  loading the model
     console.log("loading the model")
     let model = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 640 },
        multiplier: 0.75
     })
     console.log("finished loading the model")
     setModel(model);

  }

  //asks for the camera permissions
  const cameraPermissions = async()=>{
     // Camera permission.
     const {status} = await Camera.requestCameraPermissionsAsync()
     // saying the camera is active
     if(status == 'granted'){
      setPermission(true)
      return true;
     }
     // access was not given
     else{
      alert("you denied access")
      setPermission(false)
      return false;
     }
  }

  const prepare = async()=>{
    //getting and checking the camera permissions
    if (!cameraPermissions()) 
      return

    // Wait for tfjs to initialize the backend.
    await tf.ready();

    // await loadDetectionModel();
    // await loadPoseModel();   
    await loadYoloV8();
    // loadYoloV8Tflite();
     
    // saying that the model is ready 
    setModelReady(true);
  }

  useEffect(()=>{
    prepare();
  },[])


  //handles the properties of the canvas 
  const handleCanvas = async(can)=>{
    if(can){
      can.width = width;
      can.height = height;
      const ctx = can.getContext('2d');
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'red';
      ctx.lineWidth = 2;

      context.current = ctx;
      canvas.current = can;
    }

  }

  //draws the bounding boxes onto the canvas
  const drawBoundingBoxes = (prediction, image)=>{

    // if the canvas or context have not been created
    if(!canvas.current || !context.current)
      return;
    //making the height and width to scale
    const width2Scale = width/image.shape[1]
    const height2Scale = height/image.shape[0]
    
    // clearing the previous canvas drawings
    context.current.clearRect(0, 0, width, height)

    // adding all the bounding boxes for the prediction
    for(const pred of prediction){
      const [x, y, width, height] = pred.bbox;

      // calculating the position of the x in the canvas
      const xBoundingBox = canvas.current.width - x * width2Scale - width * width2Scale  
      // calculating the y
      const yBoundingBox = y* height2Scale;

      // drawing the actual bounding box
      context.current.strokeRect(xBoundingBox, yBoundingBox, width*width2Scale, height* height2Scale)

      // draw the labels
      context.current.strokeText(
        pred.class + pred.score,
        xBoundingBox - 5,
        yBoundingBox - 5
      )
    }
  }

  const drawPose = (pose, image)=>{
    // if the canvas or context have not been created
    if(!canvas.current || !context.current)
    return;

     //making the height and width to scale
    const width2Scale = width/image.shape[1]
    const height2Scale = height/image.shape[0]
    
    // clearing the previous canvas drawings
    context.current.clearRect(0, 0, width, height)

     pose.keypoints.forEach(keypoint => {
      if (keypoint.score >= 0.5) {
        const { x, y } = keypoint.position;
        console.log(x, y)
        console.log(canvas.current.width)
        console.log(canvas.current.height)
        console.log(width)
        console.log(height)

        // calculating the position of the x in the canvas
        const scaleX = canvas.current.width - x * width2Scale - width * width2Scale  
        // calculating the y
        const ScaleY = y* height2Scale;
        
        context.current.beginPath();
        context.current.arc(scaleX, ScaleY, 6, 0, 2 * Math.PI, false);
        context.current.fillStyle = 'rgba(220,152,21,0.5)';
        context.current.fill();
        context.current.closePath();
      }
    });
  }
  //gets the camera stream and does the detection on it
  const handleCameraStream = async(images, updatePreview, gl)=>{
    
    const loop = async()=>{
      if(amountRef.current != 24){
        amountRef.current++;
        updatePreview();
        gl?.endFrameEXP();
        requestAnimationFrame(loop);
        return;
      }

      amountRef.current=0;
      let imageTensor = images.next().value

      //if there is no model or image
      if(!imageTensor || !model){
        alert("no model or image");
        return 
      }
      imageTensor = (imageTensor.cast("float32")).reshape([1, 640, 640, 3])
      
      try{
        //detecting the 
        // let output = await model.execute(imageTensor)
        // let output = await model.detect(imageTensor);
        // let output = await model.estimateSinglePose(imageTensor);
        console.log(output)
        // drawPose(prediction, imageTensor)
        // prediction.map(item=>console.log(item))
        // prediction.length > 0?setAlarm(true): setAlarm(false)
        
        // drawBoundingBoxes(prediction, imageTensor)

        //clearing memory
        tf.dispose([imageTensor]);
      }
       catch(e){
        console.log("error")
        console.log(e)
       } 

       //updating the camera preview to be able to see the next image
        updatePreview();
        gl.endFrameEXP();
      
        //go to the next image
        requestAnimationFrame(loop);
      }
      loop();
      setModel(null)
  }


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
    {/* <ImageBackground source={require('../../assets/pool4.png')} style={styles.image}>     */}
      <alarmContext.Provider value={alarm}>
        <MyNotifications context={alarmContext}/>
      </alarmContext.Provider>
  
      <View style={StyleSheet.absoluteFill}>
        <TensorCamera
          ref={cameraRef}
          autorender={false}
          type={cameraType}
          style={styles.camera}
          // tensor props
          cameraTextureHeight={1200}
          cameraTextureWidth={1600}
          resizeWidth={640}
          resizeHeight={640}
          resizeDepth={3}
          rotation={0}
          onReady={handleCameraStream}
        />
        
        <Canvas style={styles.canvas} ref={handleCanvas}/>
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
    {/* </ImageBackground> */}
    </>
  )
}

export default MyCamera

const styles = StyleSheet.create({
    camera: {
      width:'90%',
      height:'80%',
      zIndex: 1,
      alignSelf: 'center',
      borderRadius: 30,
      borderWidth: 6
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
        position:'absolute',
        // bottom:30,
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
      },
      canvas:{
        position: 'absolute',
        height:'100%',
        width: '100%',
        zIndex: 1000000,

      }
})