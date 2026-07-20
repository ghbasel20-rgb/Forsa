import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';
import TextInput from './AppTextInput';

export default function PasswordInput({ style, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[style, styles.input]}
        {...props}
        secureTextEntry={!visible}
      />
      <TouchableOpacity style={styles.toggle} onPress={() => setVisible(!visible)}>
        <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  input: {
    paddingRight: 70,
  },
  toggle: {
    position: 'absolute',
    right: 20,
  },
  toggleText: {
    color: '#46a3a4',
    fontSize: 14,
    fontWeight: '600',
  },
});
