import React from 'react';
import { TextInput } from 'react-native';

export default function AppTextInput({ style, ...props }) {
  return <TextInput style={[{ fontFamily: 'Horizon-Regular' }, style]} {...props} />;
}
