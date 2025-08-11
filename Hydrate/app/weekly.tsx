
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { commonStyles, colors, typography } from '../styles/commonStyles';
import BottomNav from '../components/BottomNav';
import { useWaterData } from '../hooks/useWaterData';

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function WeeklyScreen() {
  const { goalMl, getLastNDays } = useWaterData();
  const week = getLastNDays(7).reverse(); // oldest -> newest

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={[commonStyles.content]}>
        <Text style={commonStyles.title}>Weekly progress</Text>
        <Text style={commonStyles.smallText}>Goal: {goalMl} ml</Text>

        <View style={styles.chartCard}>
          <View style={styles.chartArea}>
            {week.map((d) => {
              const pct = goalMl > 0 ? Math.min(1, d.totalMl / goalMl) : 0;
              return (
                <View key={d.date} style={styles.barItem}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${pct * 100}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{formatDayLabel(d.date)}</Text>
                  <Text style={styles.barValue}>{Math.round(pct * 100)}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.text}>Trends</Text>
          <Text style={commonStyles.smallText}>
            This simple bar chart shows the percentage of your daily goal reached for the last 7 days.
          </Text>
        </View>

        <View style={commonStyles.spacer} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    padding: 12,
    marginTop: 6,
    boxShadow: '0px 3px 10px rgba(30, 136, 229, 0.08)',
    width: '100%',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    height: 220,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barTrack: {
    width: '100%',
    height: 160,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.grey,
    ...typography.text,
  },
  barValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '800',
    ...typography.text,
  },
});
