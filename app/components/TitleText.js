import React from 'react';
import { Text } from 'react-native';

export default function TitleText({ style, ...props }) {
  return <Text style={[style, { fontFamily: 'Horizon-Regular' }]} {...props} />;
}
