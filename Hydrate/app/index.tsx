
import { Text, View, Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { commonStyles, colors, buttonStyles, typography } from '../styles/commonStyles';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';
import { useWaterData } from '../hooks/useWaterData';
import { requestNotificationPermissions, scheduleDailyReminders } from '../utils/notifications';

export default function HomeScreen() {
  const { loading, goalMl, today, addIntake, setGoal, reminders, updateReminders } = useWaterData();
  const [customMl, setCustomMl] = useState(300);

  useEffect(() => {
    console.log('HomeScreen mounted');
  }, []);

  const progress = useMemo(() => {
    return goalMl > 0 ? Math.min(1, today.totalMl / goalMl) : 0;
  }, [today.totalMl, goalMl]);

  const onToggleReminders = async () => {
    const nextEnabled = !reminders.enabled;
    if (nextEnabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        console.log('Notification permission not granted');
      }
      await scheduleDailyReminders(reminders.times);
    } else {
      await scheduleDailyReminders([]);
    }
    updateReminders({ ...reminders, enabled: nextEnabled });
  };

  const onSaveReminderTimes = async (times: string[]) => {
    updateReminders({ ...reminders, times });
    if (reminders.enabled) {
      await scheduleDailyReminders(times);
    }
  };

  const adjustCustom = (delta: number) => {
    setCustomMl(prev => {
      const next = Math.min(2000, Math.max(50, prev + delta));
      return next;
    });
  };

  const adjustGoal = (delta: number) => {
    setGoal(Math.min(10000, Math.max(250, goalMl + delta)));
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={[commonStyles.content]}>
        <View style={[commonStyles.card, styles.headerCard]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={require('../assets/images/natively-dark.png')}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.smallText}>Welcome back</Text>
              <Text style={[commonStyles.title, { marginBottom: 0 }]}>Hydrate</Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{goalMl} ml</Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <ProgressBar progress={progress} height={18} showLabel />
            <Text style={[commonStyles.smallText, { marginTop: 4 }]}>
              Today: {today.totalMl} ml / Goal: {goalMl} ml
            </Text>
          </View>
        </View>

        <View style={[commonStyles.card]}>
          <Text style={commonStyles.text}>Quick add</Text>
          <View style={[commonStyles.row]}>
            <TouchableOpacity
              style={[styles.quickAdd]}
              onPress={() => addIntake(250)}
              activeOpacity={0.85}
            >
              <Icon name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.quickAddText}>+250 ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAdd]}
              onPress={() => addIntake(500)}
              activeOpacity={0.85}
            >
              <Icon name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.quickAddText}>+500 ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAdd]}
              onPress={() => addIntake(750)}
              activeOpacity={0.85}
            >
              <Icon name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.quickAddText}>+750 ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[commonStyles.card]}>
          <Text style={commonStyles.text}>Custom amount</Text>
          <View style={[styles.stepRow]}>
            <TouchableOpacity style={[styles.stepBtn]} onPress={() => adjustCustom(-50)}>
              <Text style={styles.stepText}>- 50</Text>
            </TouchableOpacity>
            <View style={styles.customDisplay}>
              <Text style={styles.customValue}>{customMl} ml</Text>
            </View>
            <TouchableOpacity style={[styles.stepBtn]} onPress={() => adjustCustom(50)}>
              <Text style={styles.stepText}>+ 50</Text>
            </TouchableOpacity>
          </View>
          <Button text="Add custom amount" onPress={() => addIntake(customMl)} style={buttonStyles.primary} />
        </View>

        <View style={[commonStyles.card]}>
          <Text style={commonStyles.text}>Daily goal</Text>
          <View style={styles.stepRow}>
            <TouchableOpacity style={[styles.stepBtn]} onPress={() => adjustGoal(-100)}>
              <Text style={styles.stepText}>- 100</Text>
            </TouchableOpacity>
            <View style={styles.customDisplay}>
              <Text style={styles.customValue}>{goalMl} ml</Text>
            </View>
            <TouchableOpacity style={[styles.stepBtn]} onPress={() => adjustGoal(100)}>
              <Text style={styles.stepText}>+ 100</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[commonStyles.card]}>
          <Text style={commonStyles.text}>Reminders</Text>
          <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
            <Text style={commonStyles.smallText}>{reminders.enabled ? 'On' : 'Off'}</Text>
            <TouchableOpacity
              onPress={onToggleReminders}
              style={[styles.toggle, reminders.enabled && styles.toggleOn]}
              activeOpacity={0.9}
            >
              <View style={[styles.knob, reminders.enabled && styles.knobOn]} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 8 }} />
          <Text style={commonStyles.smallText}>
            Preset times: {reminders.times.join(', ')} {Platform.OS === 'web' ? '(Web limitations apply)' : ''}
          </Text>
          <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
            {['09:00', '12:00', '15:00', '18:00'].map((t) => {
              const active = reminders.times.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    let next = reminders.times;
                    if (active) {
                      next = reminders.times.filter(x => x !== t);
                    } else {
                      next = [...reminders.times, t].sort();
                    }
                    onSaveReminderTimes(next);
                  }}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ height: 4 }} />
          <Text style={commonStyles.smallText}>
            Enable reminders to schedule daily notifications at selected times.
          </Text>
        </View>

        <View style={commonStyles.spacer} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#E8F3FF',
    borderColor: '#D7EBFF',
  },
  goalBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    boxShadow: '0px 2px 6px rgba(30,136,229,0.35)',
  },
  goalBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
    ...typography.text,
  },
  quickAdd: {
    flex: 1,
    backgroundColor: '#EAF4FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(30,136,229,0.15)',
  },
  quickAddText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 2,
    ...typography.text,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  stepBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#EAF4FF',
  },
  stepText: {
    color: colors.primary,
    fontWeight: '700',
    ...typography.text,
  },
  customDisplay: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F1F8FF',
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: 'inset 0px 2px 4px rgba(30, 136, 229, 0.08)',
  },
  customValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    ...typography.text,
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#E3F2FD',
    padding: 4,
    position: 'relative',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    position: 'absolute',
    left: 4,
    top: 4,
  },
  knobOn: {
    left: 28,
  },
});
