import {StyleSheet} from 'react-native';

export const authStyles = StyleSheet.create({
  appBar: {
    width: '100%',
    alignSelf: 'stretch',
  },
  content: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  contentNoCenter: {
    height: '100%',
    width: '100%',
  },
  logo: {
    marginTop: 32,
    fontWeight: 'bold',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  text: {
    alignSelf: 'stretch',
    margin: 16,
  },
});
