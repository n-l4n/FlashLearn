import {DefaultTheme} from 'react-native-paper';

export const appColors = {
  primary: '#64B5F6',
  accent: '#CE93D8',
  textIconColor: 'rgba(0, 0, 0, .6)',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: appColors.primary,
    accent: appColors.accent,
  },
};
