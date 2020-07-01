import {SafeAreaView, View} from 'react-native';
import {Appbar, Button, FAB, Headline, Snackbar, TextInput} from 'react-native-paper';
import {appColors} from '../../theme';
import React, {useState} from 'react';
import {authStyles} from './AuthStyles';
import auth from '@react-native-firebase/auth';
import {globalStyles} from '../../GlobalStyles';
import {useBaseState} from '../../BaseState';
import ThemedStatusBar from '../app/component/ThemedStatusBar';
import {ThemeSwitcher} from '../../index';

function login(mail, password, baseState) {
  if (!mail || !password) {
    baseState.setLoading(false);
    baseState.setError('input_fail');
    return;
  }
  auth()
    .signInWithEmailAndPassword(mail, password)
    .catch(error => {
      baseState.setError(error);
      baseState.setLoading(false);
    });
}

export function LoginScreen({navigation}) {
  const baseState = useBaseState();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView
        style={[
          authStyles.content,
          {backgroundColor: ThemeSwitcher.theme.colors.backdrop},
        ]}>
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
            label="Passwort"
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
        <Snackbar
          visible={baseState.error}
          onDismiss={() => baseState.setError(null)}>
          Beim Einloggen ist etwas schief gelaufen.
        </Snackbar>
        <FAB
          style={globalStyles.fab}
          icon="login"
          loading={baseState.loading}
          disabled={baseState.loading}
          onPress={() => {
            baseState.setLoading(true);
            login(mail, password, baseState);
          }}
        />
      </SafeAreaView>
    </>
  );
}
