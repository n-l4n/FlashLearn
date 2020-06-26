import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from './AuthStyles';
import {Appbar, FAB, Headline, TextInput, Snackbar} from 'react-native-paper';
import {appColors} from '../../theme';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {globalStyles} from '../../GlobalStyles';

function sendForgotPassword(mail, setPasswordSent, setLoading, setError) {
  if (!mail) {
    setLoading(false);
    setError('input_fail');
    return;
  }
  auth()
    .sendPasswordResetEmail(mail)
    .then(() => {
      setPasswordSent(true);
      setError(null);
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      setError(error);
    });
}

export function ForgotPwScreen({navigation}) {
  const [mail, setMail] = useState('');
  const [passwordSent, setPasswordSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

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
          loading={loading}
          disabled={loading}
          onPress={() => {
            setLoading(true);
            sendForgotPassword(mail, setPasswordSent, setLoading, setError);
          }}
        />
        <Snackbar
          visible={passwordSent || error}
          onDismiss={() => {
            setPasswordSent(false);
            setError(null);
          }}>
          {error
            ? 'Beim Zurücksetzen Deines Passworts ist etwas schief gelaufen.'
            : 'Link zum Zurücksetzen versandt.'}
        </Snackbar>
      </SafeAreaView>
    </>
  );
}
