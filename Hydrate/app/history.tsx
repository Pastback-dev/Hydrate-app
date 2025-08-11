
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { commonStyles, colors, typography } from '../styles/commonStyles';
import BottomNav from '../components/BottomNav';
import { useWaterData } from '../hooks/useWaterData';

export default function HistoryScreen() {
  const { getLastNDays } = useWaterData();
  const last14 = getLastNDays(14);

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={[commonStyles.content]}>
        <Text style={commonStyles.title}>History</Text>
        {last14.map((d) => {
          const dateLabel = new Date(d.date + 'T00:00:00').toDateString();
          return (
            <View key={d.date} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{dateLabel}</Text>
                <Text style={commonStyles.smallText}>
                  {d.entries.length} entries
                </Text>
              </View>
              <Text style={styles.itemAmount}>{d.totalMl} ml</Text>
            </View>
          );
        })}
        <View style={commonStyles.spacer} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 3px 10px rgba(30, 136, 229, 0.08)',
  },
  itemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
    ...typography.text,
  },
  itemAmount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '800',
    ...typography.text,
  },
});
