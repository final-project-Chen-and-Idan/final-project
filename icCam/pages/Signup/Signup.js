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
      <View style = {styles.a}>
      <Text style = {styles.title}>Signup</Text>
      <TextInput
                style = {styles.box}
                placeholder="Email"
                // ref={email}
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect = {false}
                />
                <TextInput
                style = {styles.box}
                placeholder="Password"
                // ref={password}
                onChangeText={(password) => setPassword(password)}
                autoCapitalize="none"
                autoCorrect = {false}
                secureTextEntry={true}
                />
                 <TextInput
                 style = {styles.box}
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
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  a: {
    backgroundColor: `#5f9ea0`,
    padding: 2,
    margin:30,
    height: '70%'
  },
  box: {
    backgroundColor: `#7fffd4`,
    fontSize: 20,
    borderWidth: 2,
    margin: 10,
    padding: 1,
    paddingLeft: 3,
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
    justifyContent: 'center',
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
    justifyContent: 'center',
    alignSelf: 'center',
  }
})