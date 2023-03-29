import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import {auth} from "../../firebase"

const Contacts = () => {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")

  const addContact = async()=>{
    await search()?
    alert("exists")
    :
    alert('given email is not registered')
  }

  // finds whether or not the email exists for an active user
  const search =async()=>{
    let exists = await fetchSignInMethodsForEmail(auth, email).then(data=>{
      console.log(data)
      return data.length===0?false: true;
    }
    ).catch(error=>{return false})
    return exists
  }
  return (
    <View>
      {/*----------------- the adding area ----------------*/}
      {/* the pop up  */}
      <Modal visible={visible}>
        <TouchableOpacity onPress={()=>{setVisible(false)}}>
          <Text>x</Text>
        </TouchableOpacity>
        
        <TextInput
                  style = {styles.box}
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  autoCapitalize="none"
                  autoCorrect = {false}
        />
        <TouchableOpacity onPress={addContact}>
          <Text>Send Invite</Text>
        </TouchableOpacity>
      </Modal>

      {/* the adding button */}
      <TouchableOpacity onPress={()=>{setVisible(true)}}>
        <Text>add</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Contacts

const styles = StyleSheet.create({})