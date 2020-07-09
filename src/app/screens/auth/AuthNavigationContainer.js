import {NavigationContainer} from '@react-navigation/native';
import {LoginScreen} from './LoginScreen';
import {SignUpScreen} from './SignUpScreen';
import {ForgotPwScreen} from './ForgotPwScreen';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

export function AuthNavigationContainer() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" headerMode="none">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPwScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
