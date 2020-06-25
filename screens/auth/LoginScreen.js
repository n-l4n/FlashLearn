import {SafeAreaView, StatusBar, View} from 'react-native';
import {Appbar, Button, FAB, Headline, TextInput} from 'react-native-paper';
import {appColors} from '../../theme';
import React, { useState } from 'react';
import {authStyles} from './AuthStyles';
import auth from '@react-native-firebase/auth';
import {globalStyles} from '../../GlobalStyles';

function login(mail, password) {
  auth()
    .signInWithEmailAndPassword(mail, password)
    .catch(error => {
      console.log(error);
    });
}

export function LoginScreen({navigation}) {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.Content title="Login" />
          <Appbar.Action
            icon="lock-question"
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </Appbar.Header>
        <Headline style={authStyles.logo}>FlashLearn</Headline>
        <View style={authStyles.contentContainer}>
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="email" />
            }
            label="Email"
            value={mail}
            onChangeText={text => setMail(text)}
            style={authStyles.text}
          />
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="lock" />
            }
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            style={authStyles.text}
          />
          <Button
            mode="text"
            color={appColors.accent}
            onPress={() => navigation.navigate('SignUp')}>
            Oder registrieren
          </Button>
        </View>
        <FAB
          style={globalStyles.fab}
          icon="login"
          onPress={() => login(mail, password)}
        />
      </SafeAreaView>
    </>
  );
}
