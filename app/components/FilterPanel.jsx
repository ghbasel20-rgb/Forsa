import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';

export default function FilterPanel({ activeCount = 0, onClear, children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.toggle} onPress={() => setExpanded((prev) => !prev)}>
          <Text style={styles.toggleText}>
            {expanded ? 'Hide Filters ▲' : `Filters${activeCount > 0 ? ` (${activeCount})` : ''} ▼`}
          </Text>
        </TouchableOpacity>

        {activeCount > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    paddingVertical: 8,
  },
  toggleText: {
    color: '#0a445c',
    fontSize: 16,
    fontWeight: '600',
  },
  clearText: {
    color: '#c6a2ba',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  body: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    marginTop: 12,
  },
});
