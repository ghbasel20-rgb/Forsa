import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';

export default function SingleChoiceRow({ label, options, value, onChange }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, value === option.value && styles.chipSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.chipText, value === option.value && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a445c',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#46a3a4',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#46a3a4',
    borderColor: '#46a3a4',
  },
  chipText: {
    color: '#46a3a4',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#ffffff',
  },
});
