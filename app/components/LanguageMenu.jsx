import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import GlobeIcon from '../../assets/images/globe.svg';
import Text from './AppText';
import { getLanguage, LANGUAGES, setLanguage } from '../services/language-service';

export default function LanguageMenu() {
  const buttonRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    getLanguage().then(setLanguageState);
  }, []);

  const openMenu = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ top: y + height + 6, left: x });
      setVisible(true);
    });
  };

  const handleSelect = async (code) => {
    setLanguageState(code);
    setVisible(false);
    await setLanguage(code);
  };

  return (
    <>
      <TouchableOpacity ref={buttonRef} style={styles.button} onPress={openMenu}>
        <GlobeIcon width={26} height={26} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          {anchor && (
            <View style={[styles.menu, { top: anchor.top, left: anchor.left }]}>
              {LANGUAGES.map((option) => (
                <TouchableOpacity
                  key={option.code}
                  style={styles.menuItem}
                  onPress={() => handleSelect(option.code)}
                >
                  <Text
                    style={[styles.menuItemText, language === option.code && styles.menuItemTextActive]}
                  >
                    {option.label}
                  </Text>
                  {language === option.code && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 15,
    color: '#0a445c',
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: '#46a3a4',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 15,
    color: '#46a3a4',
    fontWeight: '700',
  },
});
