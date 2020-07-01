import {DefaultTheme} from 'react-native-paper';
import {ThemeSwitcher} from './index';

export const appColors = {
  primary: '#64B5F6',
  accent: '#CE93D8',
  textIconColor: 'rgba(0, 0, 0, .6)',
};

export function themedBackgroundColor() {
  return {
    backgroundColor: ThemeSwitcher.theme.colors.backdrop,
  };
}
