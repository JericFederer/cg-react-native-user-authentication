import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '@/store/auth-context';

function WelcomeScreen() {
  // * useState
  const [fetchedMessage, setFetchedMessage] = useState('');

  // * useContext
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  // * useEffect
  useEffect(() => {
    axios.get('https://rn-userauthentication-bbd48-default-rtdb.asia-southeast1.firebasedatabase.app/message.json?auth=' + token)
      .then((response) => {
        setFetchedMessage(response.data)
      });
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{ fetchedMessage }</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
