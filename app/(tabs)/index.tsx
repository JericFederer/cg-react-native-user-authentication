import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { Colors } from '@/constants/styles';
import AuthContextProvider, { AuthContext } from '@/store/auth-context';
import IconButton from '@/components/ui/IconButton';

// * Keep the splash screen visible while app checks login status
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={ LoginScreen } />
      <Stack.Screen name="Signup" component={ SignupScreen } />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  // * useContext
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={ WelcomeScreen }
        options={{
          headerRight: ({ tintColor }) => <IconButton
            icon="exit"
            color={ tintColor }
            size={ 24 }
            onPress={ authCtx.logout }
          />
        }}  
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  // * useContext
  const authCtx = useContext(AuthContext);

  return (
      <NavigationContainer independent={ true }>
        { !authCtx.isAuthenticated && <AuthStack /> }
        { authCtx.isAuthenticated && <AuthenticatedStack /> }
      </NavigationContainer>
  );
}

function Root() {
  // * useState
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  // * useContext
  const authCtx = useContext(AuthContext);

  // * useEffect
  useEffect(() => {
    async function fetchTokenFromDevice() {
      // * 'AsyncStorage.getItem' returns a promise
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchTokenFromDevice();
  }, []);

  // * Checks if user has always been logged in at the start of the app
  if (!isTryingLogin) {
    SplashScreen.hideAsync();    
  }

  return <Navigation />
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
