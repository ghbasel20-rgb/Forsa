import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';
import TextInput from './AppTextInput';

export default function ChipSelector({
  options,
  selected,
  onChange,
  modalTitle = 'Enter Your Own',
  placeholder = 'Type here',
  submitLabel = 'Add',
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const toggle = (option) => {
    if (option === 'Other') {
      setShowCustomInput(true);
    } else if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange([...selected, customValue.trim()]);
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const customSelections = selected.filter((item) => !options.includes(item));

  return (
    <>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, selected.includes(option) && styles.chipSelected]}
            onPress={() => toggle(option)}
          >
            <Text style={[styles.chipText, selected.includes(option) && styles.chipTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {customSelections.map((custom) => (
          <TouchableOpacity
            key={custom}
            style={[styles.chip, styles.chipSelected]}
            onPress={() => onChange(selected.filter((s) => s !== custom))}
          >
            <Text style={[styles.chipText, styles.chipTextSelected]}>{custom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={showCustomInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomInput(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCustomInput(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#46a3a4"
              value={customValue}
              onChangeText={setCustomValue}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCustomSubmit}>
              <Text style={styles.buttonText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#0a445c',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
