import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../../firebase'
import { sendEmailVerification } from 'firebase/auth'
import Icon from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context'


const Verify = () => {

    // seding the verifying email
    const verify = (user)=>{
        sendEmailVerification(user).then(alert("verification email has been sent"))
    }

    const verified = async()=>{
        await auth.currentUser.reload()
        if(!auth.currentUser.emailVerified)
            alert("email has not been verified")
        else
          auth.signOut()
    }
  return (
    <SafeAreaView>
        <TouchableOpacity onPress={()=>auth.signOut()}>
          <Icon name="x" size={30}/>
        </TouchableOpacity>
        <View style={styles.box}>
            <Text style = {{fontSize: 30,}}>please verify your email</Text>
            <TouchableOpacity onPress={()=>verify(auth.currentUser)}>
                <View >
                <Text>if link was not sent press here to Verify</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={verified}>
                <Text>Email has Been verified</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default Verify

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