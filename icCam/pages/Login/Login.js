import { StyleSheet, Text, View , TouchableOpacity, TextInput} from 'react-native'
import React , {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../../firebase'



const Login = () => {
    const navigation = useNavigation();
    const[email, setEmail] = useState('');
    const[passord, setPassord] = useState('');


    loginUser = async(email, passord) => {
        try{
            await auth.signInWiteEmailAndPassord(email, passord)
        } catch(error){
            alert(error + "hjkg")
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
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect = {false}
                />
                <TextInput
                placeholder="Password"
                onChangeText={(password) => setPassord(passord)}
                autoCapitalize="none"
                autoCorrect = {false}
                secureTextEntry={true}
                />
            </View>
            <TouchableOpacity
                onPress={() => loginUser(email, passord)}
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

//   return (
//     <View>
//       <Text>Login</Text>
//     </View>
//   )
}

export default Login

const styles = StyleSheet.create({
backgroundColor: '#fff'
})