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
            <Text>
                Login
            </Text>
            <View>
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
            </View>
            <TouchableOpacity
                onPress={() => loginUser(email, password)}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
            >
                <Text>Don't have an account? Register Now</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default Login

const styles = StyleSheet.create({
backgroundColor: '#fff'
})