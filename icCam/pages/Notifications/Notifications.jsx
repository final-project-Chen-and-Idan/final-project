import { StyleSheet, Text, TouchableOpacity, View, Button, Platform } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const MyNotifications = () => {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
    )
}
export default MyNotifications