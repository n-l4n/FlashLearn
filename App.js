/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthNavigationContainer} from './screens/auth/AuthNavigationContainer';
import {AppNavigationContainer} from './screens/app/AppNavigationContainer';
import {LoadingScreen} from './screens/auth/LoadingScreen';

const App: () => React$Node = () => {
  // Set an initializing state whilst Firebase connects
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
