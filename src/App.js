/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthNavigationContainer} from './app/screens/auth/AuthNavigationContainer';
import {AppNavigationContainer} from './app/screens/app/AppNavigationContainer';
import {LoadingScreen} from './app/screens/auth/LoadingScreen';

const App: () => React$Node = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    // Handle user state changes
    function onAuthStateChanged(updatedUser) {
      setUser(updatedUser);
      if (initializing) {
        setInitializing(false);
      }
    }

    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, [initializing]);

  if (initializing) {
    return LoadingScreen();
  } else {
    if (user) {
      return AppNavigationContainer();
    } else {
      return AuthNavigationContainer();
    }
  }
};

export default App;
