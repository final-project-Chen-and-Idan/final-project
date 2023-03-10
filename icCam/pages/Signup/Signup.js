import { StyleSheet, Text, View, TextInput ,TouchableOpacity} from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React , {useRef, useState} from 'react'
import { auth } from '../../firebase'


const Signup = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState(''); 
  const[passwordAuthentication, setPasswordAuthentication] = useState(''); 

  CreateUser = async(email, password, passwordAuthentication) => {
    if(password === passwordAuthentication){
      try{
        await createUserWithEmailAndPassword(auth, email, password)
    } catch(error){
        alert(error)
    }
    }
    else{
      alert("Password verification does not match")
    }
 
  }
  return (
    <View>
      <Text>Signup</Text>
      <TextInput
                placeholder="Email"
                // ref={email}
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect = {false}
                />
                <TextInput
                placeholder="Password"
                // ref={password}
                onChangeText={(password) => setPassword(password)}
                autoCapitalize="none"
                autoCorrect = {false}
                secureTextEntry={true}
                />
                 <TextInput
                placeholder="Password Authentication"
                // ref={password}
                onChangeText={(passwordAuthentication) => setPasswordAuthentication(passwordAuthentication)}
                autoCapitalize="none"
                autoCorrect = {false}
                secureTextEntry={true}
                />
              <TouchableOpacity
                style = {styles.button}
                onPress={() => CreateUser(email, password, passwordAuthentication)}
            >
                <Text style = {styles.buttonText}>Signup</Text>
            </TouchableOpacity>
                
      

    </View>
  )
}

export default Signup

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
})