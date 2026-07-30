import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import BellIcon from '../../assets/images/notification.svg';
import BellMsgIcon from '../../assets/images/notificationMsg.svg';
import Text from './AppText';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentUser } from '../services/auth-service';
import { getEventWithTranslation } from '../services/events-service';
import { getUserProfile, updateUserProfile } from '../services/profile-service';
import {
  getApplicationNotifications,
  markApplicationNotificationsSeen,
} from '../services/saved-events-service';

// Both svgs share the same 217x122 canvas but the bell only occupies the
// left ~half of it; cropping the viewBox keeps the icon centered and square-ish.
const BELL_VIEWBOX = '58 0 104 122';

export default function NotificationBell({ registerTarget }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const loadNotifications = useCallback(async () => {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      setSignedIn(false);
      setNotifications([]);
      setHasUnread(false);
      return;
    }
    setSignedIn(true);

    const [applicationResult, profileResult] = await Promise.all([
      getApplicationNotifications(userResult.data.$id),
      getUserProfile(userResult.data.$id),
    ]);

    const applicationNotifications = applicationResult.success
      ? await Promise.all(
          applicationResult.data.map(async (application) => {
            const eventResult = await getEventWithTranslation(application.eventId, language);
            const event = eventResult.success ? eventResult.data : null;
            const eventTitle = (language === 'ar' && event?.titleAr) || event?.title || '';
            return { ...application, type: 'application', eventTitle };
          })
        )
      : [];

    const profile = profileResult.success ? profileResult.data : null;
    const welcomeNotification = profile
      ? [
          {
            $id: 'welcome',
            type: 'welcome',
            profileId: profile.$id,
            notificationSeen: Boolean(profile.welcomeNotificationSeen),
          },
        ]
      : [];

    const allNotifications = [...welcomeNotification, ...applicationNotifications];
    setNotifications(allNotifications);
    setHasUnread(allNotifications.some((item) => !item.notificationSeen));
  }, [language]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const closePanel = async () => {
    setVisible(false);
    const unseen = notifications.filter((item) => !item.notificationSeen);
    if (unseen.length === 0) return;

    const applicationIds = unseen.filter((item) => item.type === 'application').map((item) => item.$id);
    const welcomeItem = unseen.find((item) => item.type === 'welcome');

    await Promise.all([
      applicationIds.length > 0 ? markApplicationNotificationsSeen(applicationIds) : Promise.resolve(),
      welcomeItem ? updateUserProfile(welcomeItem.profileId, { welcomeNotificationSeen: true }) : Promise.resolve(),
    ]);
    setNotifications((prev) => prev.map((item) => ({ ...item, notificationSeen: true })));
    setHasUnread(false);
  };

  const handleItemPress = (item) => {
    closePanel();
    if (item.type === 'application') {
      router.push(`/Status?id=${item.$id}`);
    }
  };

  const Icon = hasUnread ? BellMsgIcon : BellIcon;

  if (!signedIn) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        ref={registerTarget?.('notifications')}
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Icon width={22} height={26} viewBox={BELL_VIEWBOX} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={closePanel}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closePanel}>
          <View style={styles.panel} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('notifications.title')}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closePanel}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
            ) : (
              notifications.map((item) => (
                <TouchableOpacity
                  key={item.$id}
                  style={styles.item}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={[styles.dot, !item.notificationSeen && styles.dotUnread]} />
                  <Text style={styles.itemText} numberOfLines={2}>
                    {item.type === 'welcome'
                      ? t('notifications.welcome')
                      : t(`notifications.${item.status === 'Approved' ? 'approved' : 'denied'}`, {
                          event: item.eventTitle,
                        })}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#0a445c',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  closeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0a445c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#46a3a4',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#e1e4e4',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#46a3a4',
  },
  dotUnread: {
    backgroundColor: '#c6a2ba',
  },
  itemText: {
    flex: 1,
    color: '#0a445c',
    fontSize: 13,
    fontWeight: '500',
  },
});
