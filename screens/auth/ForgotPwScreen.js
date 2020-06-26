import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from './AuthStyles';
import {Appbar, FAB, Headline, TextInput, Snackbar} from 'react-native-paper';
import {appColors} from '../../theme';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {globalStyles} from '../../GlobalStyles';
import {useBaseState} from '../../BaseState';

function sendForgotPassword(mail, setPasswordSent, baseState) {
  if (!mail) {
    baseState.setLoading(false);
    baseState.setError('input_fail');
    return;
  }
  auth()
    .sendPasswordResetEmail(mail)
    .then(() => {
      setPasswordSent(true);
      baseState.setError(null);
      baseState.setLoading(false);
    })
    .catch(error => {
      baseState.setLoading(false);
      baseState.setError(error);
    });
}

export function ForgotPwScreen({navigation}) {
  const baseState = useBaseState();
  const [mail, setMail] = useState('');
  const [passwordSent, setPasswordSent] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Passwort vergessen" />
        </Appbar.Header>
        <Headline style={authStyles.logo}>FlashLearn</Headline>
        <View style={authStyles.contentContainer}>
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="email" />
            }
            label="Email"
            style={authStyles.text}
            disabled={passwordSent}
            value={mail}
            onChangeText={text => setMail(text)}
          />
        </View>
        <FAB
          style={globalStyles.fab}
          icon="check"
          loading={baseState.loading}
          disabled={baseState.loading}
          onPress={() => {
            baseState.setLoading(true);
            sendForgotPassword(mail, setPasswordSent, baseState);
          }}
        />
        <Snackbar
          visible={passwordSent || baseState.error}
          onDismiss={() => {
            setPasswordSent(false);
            baseState.setError(null);
          }}>
          {baseState.error
            ? 'Beim Zurücksetzen Deines Passworts ist etwas schief gelaufen.'
            : 'Link zum Zurücksetzen versandt.'}
        </Snackbar>
      </SafeAreaView>
    </>
  );
}
