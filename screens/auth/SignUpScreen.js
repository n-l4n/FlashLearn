import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  FAB,
  TextInput,
  Headline,
  Snackbar,
} from 'react-native-paper';
import {appColors} from '../../theme';
import React, {useState} from 'react';
import {authStyles} from './AuthStyles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {globalStyles} from '../../GlobalStyles';

function signUp(mail, name, password, setLoading, setError) {
  if (!mail || !name || !password) {
    setLoading(false);
    setError('input_fail');
    return;
  }
  auth()
    .createUserWithEmailAndPassword(mail, password)
    .then(response => {
      firestore()
        .collection('users')
        .doc(response.user.uid)
        .set({
          name: name,
        });
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
}

export function SignUpScreen({navigation}) {
  const [mail, setMail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.Content title="Registrieren" />
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
              <TextInput.Icon color={appColors.textIconColor} name="account" />
            }
            label="Name"
            value={name}
            onChangeText={text => setName(text)}
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
            onPress={() => navigation.goBack()}>
            Oder einloggen
          </Button>
        </View>
        <Snackbar visible={error} onDismiss={() => setError(null)}>
          Beim Registrieren ist etwas schief gelaufen.
        </Snackbar>
        <FAB
          style={globalStyles.fab}
          icon="check"
          loading={loading}
          disabled={loading}
          onPress={() => {
            setLoading(true);
            signUp(mail, name, password, setLoading, setError);
          }}
        />
      </SafeAreaView>
    </>
  );
}
