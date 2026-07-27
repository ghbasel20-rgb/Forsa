import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './AppText';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../services/language-service';

export default function LanguagePickerModal({ visible, language, onClose, onSelect }) {
  const { t } = useLanguage();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>{t('common.selectLanguage')}</Text>
          {LANGUAGES.map((option) => (
            <TouchableOpacity
              key={option.code}
              style={styles.option}
              onPress={() => onSelect(option.code)}
            >
              <Text style={[styles.optionText, language === option.code && styles.optionTextActive]}>
                {option.label}
              </Text>
              {language === option.code && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e4',
  },
  optionText: {
    fontSize: 16,
    color: '#0a445c',
  },
  optionTextActive: {
    color: '#46a3a4',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    color: '#46a3a4',
    fontWeight: '700',
  },
});
