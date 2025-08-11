
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePathname, router } from 'expo-router';
import Icon from './Icon';
import { colors, commonStyles, typography } from '../styles/commonStyles';

export default function BottomNav() {
  const pathname = usePathname();
  const items = [
    { key: 'home', label: 'Home', icon: 'water-outline' as const, path: '/' },
    { key: 'history', label: 'History', icon: 'time-outline' as const, path: '/history' },
    { key: 'weekly', label: 'Weekly', icon: 'bar-chart-outline' as const, path: '/weekly' },
  ];

  return (
    <View style={commonStyles.bottomNav}>
      {items.map((item) => {
        const active = pathname === item.path;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => router.replace(item.path)}
            style={[styles.item, active && styles.activeItem]}
            activeOpacity={0.85}
          >
            <Icon name={item.icon} size={22} color={active ? '#ffffff' : colors.primary} />
            <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
  },
  activeItem: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    ...typography.text,
  },
  activeLabel: {
    color: '#ffffff',
  },
});
