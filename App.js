import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {

  const [hasPermissionMessaging, setHasPermissionMessaging] = useState(false);
  const [token, setToken] = useState('');

  useEffect(()=> {
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage.notification);
    });

    return unsubscribe;
  }, []);

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage.notification);
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
