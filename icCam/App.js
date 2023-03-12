import { createStackNavigator } from '@react-navigation/stack'
import React, {useState, useEffect}from 'react'
import {auth} from './firebase'
import Login from './pages/Login/Login'
import Camera from './pages/Camera/Camera'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home'
import { NavigationContainer } from '@react-navigation/native'
import {View, Text, StyleSheet} from 'react-native'

const Stack = createStackNavigator();

export default function App() {
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
    if(auth.currentUser.emailVerified)
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
        );
  
}

const styles = StyleSheet.create({
});
