import { StyleSheet, Text, View , TouchableOpacity, TextInput} from 'react-native'
import React , {useRef, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../../firebase'
import {signInWithEmailAndPassword} from 'firebase/auth'


const Login = () => {
    const navigation = useNavigation();
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');


    loginUser = async(email, password) => {
        try{
            await signInWithEmailAndPassword(auth, email, password)
        } catch(error){
            alert(error)
        }
    }

    return(
        <View>
            <Text style = {styles.title}>
                Login
            </Text>
            <View>
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
            </View>
            <TouchableOpacity
                style = {styles.button}
                onPress={() => loginUser(email, password)}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style = {styles.button}
                onPress={() => navigation.navigate('Signup')}
            >
                <Text>Don't have an account? Register Now</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default Login

const styles = StyleSheet.create({
    
    box: {
        backgroundColor: `#7fffd4`,
        fontSize: 20,
        borderWidth: 2,
        margin: 4
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
      title: {
        //fontSize: 10,
        fontWeight: 'bold',
        fontSize: 20,
      }
})