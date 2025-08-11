
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Ensure notifications show on foreground (Android)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL || false;
  } catch (e) {
    console.log('Notification permission error', e);
    return false;
  }
}

function nextTriggerForTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(h, m, 0, 0);
  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger;
}

export async function scheduleDailyReminders(times: string[]) {
  if (Platform.OS === 'web') {
    console.log('Web platform: notifications are limited on web.');
    return [];
  }
  try {
    // Cancel existing
    const current = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(current.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));

    const ids: string[] = [];
    for (const time of times) {
      const triggerDate = nextTriggerForTime(time);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to hydrate',
          body: 'Log a glass of water to stay on track.',
          sound: undefined,
        },
        trigger: {
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
          repeats: true,
        },
      });
      ids.push(id);
    }
    console.log('Scheduled reminders', ids);
    return ids;
  } catch (e) {
    console.log('Failed to schedule reminders', e);
    return [];
  }
}
