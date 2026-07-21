import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
        <Ionicons name={visible ? 'eye-off' : 'eye'} size={22} color="#0E445C" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  input: {
    paddingRight: 48,
  },
  toggle: {
    position: 'absolute',
    right: 20,
  },
});
