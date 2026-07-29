import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import GlobeIcon from '../../assets/images/globe.svg';
import LanguagePickerModal from './LanguagePickerModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageMenu() {
  const [visible, setVisible] = useState(false);
  const { language, changeLanguage } = useLanguage();

  const handleSelect = (code) => {
    setVisible(false);
    changeLanguage(code);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <GlobeIcon width={26} height={26} />
      </TouchableOpacity>

      <LanguagePickerModal
        visible={visible}
        language={language}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
