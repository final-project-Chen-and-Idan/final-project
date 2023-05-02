import { StyleSheet, Text, View, TextInput ,TouchableOpacity, ImageBackground} from 'react-native'
import { createUserWithEmailAndPassword} from "firebase/auth";
import React , {useState} from 'react'
import { auth } from '../../firebase'



const Signup = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState(''); 
  const[passwordAuthentication, setPasswordAuthentication] = useState(''); 
    
    const image = {uri: "data:image/jpeg;base64,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"}

  const CreateUser = (email, password, passwordAuthentication) => {
    if(password == ""){
      alert("fill in the password")
    }
    else if(password === passwordAuthentication){
        createUserWithEmailAndPassword(auth, email, password).catch(e=>{
          switch(e.code){
            case "auth/email-already-in-use":
              alert("the email is already being used");
              break;
            
            case "auth/invalid-email":
              alert("invalid email")
              break
            default:
              alert(e)
          }
        })
    }
    else{
      alert("Password verification does not match")
    }
 
  }

  return (
    <ImageBackground source={image} style={styles.image}>
    
      <View style = {styles.a}>
        <View style = {styles.b}>
            <Text style = {styles.title}>Signup</Text>
            <View style={styles.c}>
              <TextInput
                        style = {styles.box}
                        placeholder="Email"
                        onChangeText={(email) => setEmail(email)}
                        autoCapitalize="none"
                        autoCorrect = {false}
                        />
              <TextInput
                        style = {styles.box}
                        placeholder="Password"
                        onChangeText={(password) => setPassword(password)}
                        autoCapitalize="none"
                        autoCorrect = {false}
                        secureTextEntry={true}
                        />
              <TextInput
                        style = {styles.box}
                        placeholder="Password Authentication"
                        onChangeText={(passwordAuthentication) => setPasswordAuthentication(passwordAuthentication)}
                        autoCapitalize="none"
                        autoCorrect = {false}
                        secureTextEntry={true}
                        />
              
            </View>
            <TouchableOpacity
                    style = {styles.button}
                    onPress={() => CreateUser(email, password, passwordAuthentication)}>
                    <Text >next</Text>
            </TouchableOpacity>
            
           
          </View>
        </View>
    
    </ImageBackground>
  )
}

export default Signup

const styles = StyleSheet.create({
  a: {
    // backgroundColor: `#5f9ea0`,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    // opacity: '50%',
    Transparent: '50%',
    padding: 1,
    margin:30,
    height: '70%',
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  b: {
    height: '80%',
    width: '80%',
  },
  c: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    padding: 3,
    margin:30,
    height: '50%',
    width: '99%',
    alignSelf: 'center',
    
  },
  box: {
    backgroundColor: `#ffe4c4`,
    fontSize: 20,
    borderWidth: 2,
    margin: 10,
    padding: 3,
    paddingLeft: 3,
    borderRadius: 10,
},
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
  title: {
    //fontSize: 10,
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center'
  },
  image: {
    height: '105%',
    // marginBottom: 200,
  },
  
})