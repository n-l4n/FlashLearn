import auth from '@react-native-firebase/auth';

export class AuthHelper {
  static userId() {
    return auth().currentUser.uid;
  }

  static userMail() {
    return auth().currentUser.email;
  }
}
