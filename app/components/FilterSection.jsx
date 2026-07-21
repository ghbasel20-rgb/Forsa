import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './AppText';
import ChipSelector from './ChipSelector';

export default function FilterSection({ label, options, selected, onChange }) {
  if (options.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <ChipSelector options={options} selected={selected} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a445c',
    marginBottom: 8,
  },
});
