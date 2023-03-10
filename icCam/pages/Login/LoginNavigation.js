import { createStackNavigator } from '@react-navigation/stack'
import React, {useState, useEffect}from 'react'
import {auth} from '../../firebase'
import Login from './Login'
import Camera from '../Camera/Camera'
import Signup from '../Signup/Signup'
import Home from '../Home/Home'
import { NavigationContainer } from '@react-navigation/native'
import {View, Text, StyleSheet} from 'react-native'

const Stack = createStackNavigator();
function LoginNavigation(){
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user){
        setUser(user);
        if(initializing) setInitializing(false);
    }
    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber
    } , [])

    if(initializing) return null;

    if(!user){
        return (
            <NavigationContainer>

          
            <Stack.Navigator>
                <Stack.Screen
                    name = "login"
                    component = {Login}
                />
               
                <Stack.Screen
                    name = "Signup"
                    component = {Signup}
                />
              
            </Stack.Navigator>
            </NavigationContainer>
        )
        
        
    }
    if(!auth.currentUser.emailVerified)
        return(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name = "Home"
                                component = {Home}
                                
                    />
                    <Stack.Screen
                        name="Camera"
                        component={Camera}

                    />
                </Stack.Navigator>
            </NavigationContainer>
        )

    
        return(
            <View>
                <Text style = {{fontSize: 30,}}>pleass verify your email</Text>
            </View>
        )
    

}
export default LoginNavigation
   
        
const styles = StyleSheet.create({
   
  })
