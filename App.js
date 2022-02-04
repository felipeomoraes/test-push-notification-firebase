import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export default function App() {

  const [hasPermissionMessaging, setHasPermissionMessaging] = useState(false);
  const [token, setToken] = useState('');

  useEffect(()=> {
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage.notification)
      console.log('A new FCM message arrived!', remoteMessage);
    });

    return unsubscribe;
  }, []);

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    onDisplayNotification(remoteMessage.notification)
    // console.log('Message handled in the background!', remoteMessage);
  });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      setHasPermissionMessaging(true)
      console.log('Authorization status:', authStatus);
    }
  }

  async function getTokenFirebase() {
    const newToken = await messaging().getToken();
    setToken(newToken);
    console.log("Token: " + newToken);
  }

  async function onDisplayNotification(notication) {
    // Create a channel
    const channelId = await notifee.createChannel({
      // id: 'default',
      id: 'important',
      name: 'Default Channel',
      vibration: true,
      vibrationPattern: [300, 500],
    });

    // Display a notification
    await notifee.displayNotification({

      title: '<p style="color: #4caf50;"><b>'+notication.title+'</span></p></b></p> &#128576;',
      subtitle: '&#129395;',
      body:
        '<p>'+notication.body+'</p> &#127881;!',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        color: '#4caf50',
        actions: [
          {
            title: '<b>Dance</b> &#128111;',
            pressAction: { id: 'dance' },
          },
          {
            title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
            pressAction: { id: 'cry' },
          },
        ],
      },
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ fontSize:32, marginBottom:10 }}>Firebase</Text>
      <TouchableOpacity 
        style={{
          backgroundColor: 'blue',
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5 
        }}
        onPress={() => getTokenFirebase()}>
        <Text style={{
          color:"#fff",
          fontSize: 32
        }}>Token</Text>
      </TouchableOpacity>
      <Text style={{ fontSize:32, marginBottom:10 }}>{token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
