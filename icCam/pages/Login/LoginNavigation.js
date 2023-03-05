import { createStackNavigator } from '@react-navigation/stack'
import React, {useState, useEffect}from 'react'
import {auth} from '../../firebase'
import Login from './Login'
import Camera from '../Camera/Camera'
import Signup from '../Signup/Signup'
import Home from '../Home/Home'
import { NavigationContainer } from '@react-navigation/native'

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
                    // options = {{
                    //     headerTitle: () => <Headers name = "Bug Ninza"/>,
                    //     headerStyle: {
                        
                    //     }
                    // }}
                />
               
                <Stack.Screen
                    name = "Signup"
                    component = {Signup}
                    // options = {{
                    //     headerTitle: () => <Headers name = "Bug Ninza"/>,
                    //     headerStyle: {
                            
                    //     }
                    // }}
                />
              
            </Stack.Navigator>
            </NavigationContainer>
        )
        
        
    }
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name = "Home"
                            component = {Home}
                            // options = {{
                            //     headerTitle: () => <Headers name = "Bug Ninza"/>,
                            //     headerStyle: {
                                    
                            //     }
                            // }}
                />
                  <Stack.Screen
                    name="Camera"
                    component={Camera}

                />
            </Stack.Navigator>
        </NavigationContainer>
    )

}
export default LoginNavigation
   
        
   
