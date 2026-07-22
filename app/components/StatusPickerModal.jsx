import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';
import TextInput from './AppTextInput';
import { useLanguage } from '../contexts/LanguageContext';

export const STATUS_OPTIONS = [
  'High School Student',
  'High School Graduate',
  'University Student',
  'University Graduate',
  'Other',
];

export default function StatusPickerModal({ visible, onClose, onSubmit }) {
  const { t } = useLanguage();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleSelect = (option) => {
    if (option === 'Other') {
      setShowCustomInput(true);
    } else {
      onSubmit(option);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onSubmit(customValue.trim());
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const handleClose = () => {
    setShowCustomInput(false);
    setCustomValue('');
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible && !showCustomInput}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>{t('statusPickerModal.selectStatusTitle')}</Text>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={visible && showCustomInput}
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
            <Text style={styles.modalTitle}>{t('statusPickerModal.enterStatusTitle')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('statusPickerModal.statusPlaceholder')}
              placeholderTextColor="#46a3a4"
              value={customValue}
              onChangeText={setCustomValue}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCustomSubmit}>
              <Text style={styles.buttonText}>{t('common.submit')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e4',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#0a445c',
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
