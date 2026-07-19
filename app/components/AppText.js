import React from 'react';
import { Text } from 'react-native';

export default function AppText({ style, ...props }) {
  return <Text style={[{ fontFamily: 'Horizon-Regular' }, style]} {...props} />;
}
