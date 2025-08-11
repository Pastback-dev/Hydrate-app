
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayLog, WaterEntry, WaterState, ReminderSettings } from '../data/types';

const STORAGE_KEY = 'water_state_v1';
const REMINDER_KEY = 'water_reminders_v1';
const DEFAULT_GOAL = 2000;

const toDateKey = (date: Date = new Date()) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const createInitialState = (): WaterState => ({
  goalMl: DEFAULT_GOAL,
  days: {},
});

export function useWaterData() {
  const [state, setState] = useState<WaterState>(createInitialState());
  const [reminders, setReminders] = useState<ReminderSettings>({ enabled: false, times: ['09:00', '12:00', '15:00'] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const savedRem = await AsyncStorage.getItem(REMINDER_KEY);
        if (raw) {
          const parsed: WaterState = JSON.parse(raw);
          setState(parsed);
        }
        if (savedRem) {
          const parsedRem: ReminderSettings = JSON.parse(savedRem);
          setReminders(parsedRem);
        }
      } catch (e) {
        console.log('Failed to load water state', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistState = useCallback(async (next: WaterState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('Failed to persist water state', e);
    }
  }, []);

  const persistReminders = useCallback(async (next: ReminderSettings) => {
    try {
      await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('Failed to persist reminder settings', e);
    }
  }, []);

  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const today = state.days[todayKey] ?? { date: todayKey, totalMl: 0, entries: [] };

  const addIntake = useCallback((amountMl: number) => {
    setState(prev => {
      const key = toDateKey(new Date());
      const day = prev.days[key] ?? { date: key, totalMl: 0, entries: [] };
      const newEntry: WaterEntry = { id: `${Date.now()}-${Math.random()}`, amountMl, timestamp: Date.now() };
      const next: WaterState = {
        ...prev,
        days: {
          ...prev.days,
          [key]: {
            ...day,
            totalMl: day.totalMl + amountMl,
            entries: [newEntry, ...day.entries],
          },
        },
      };
      persistState(next);
      console.log('Intake added', amountMl, 'ml');
      return next;
    });
  }, [persistState]);

  const setGoal = useCallback((goalMl: number) => {
    setState(prev => {
      const next: WaterState = { ...prev, goalMl: Math.max(250, Math.min(goalMl, 10000)) };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const getLastNDays = useCallback((n: number) => {
    const res: DayLog[] = [];
    const now = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = toDateKey(d);
      res.push(state.days[key] ?? { date: key, totalMl: 0, entries: [] });
    }
    return res;
  }, [state.days]);

  const updateReminders = useCallback((next: ReminderSettings) => {
    setReminders(next);
    persistReminders(next);
  }, [persistReminders]);

  return {
    loading,
    goalMl: state.goalMl,
    today,
    addIntake,
    setGoal,
    getLastNDays,
    reminders,
    updateReminders,
  };
}
