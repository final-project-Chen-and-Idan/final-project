import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SearchBar } from 'react-native-elements'

const Contacts = () => {
  const [visible, setVisible] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const addContact = ()=>{
    
  }

  const search = (text)=>{

  }

  return (
    <View>
      {/*----------------- the adding area ----------------*/}
      {/* the pop up  */}
      <Modal visible={visible}>
        <TouchableOpacity onPress={()=>{setVisible(false)}}>
          <Text>x</Text>
        </TouchableOpacity>
        
        <SearchBar
          placeholder='enter contact email'
          lightTheme
          round
          value={searchInput}
          onChangeText={(text) => {search(text); setSearchInput(text)}}
          autoCorrect={false}
        />
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