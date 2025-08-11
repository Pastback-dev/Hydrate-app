
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../styles/commonStyles';

interface ProgressBarProps {
  progress: number; // 0..1
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, height = 16, showLabel = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fill, { width: `${clamped * 100}%` }]}
      />
      {showLabel && (
        <Text style={styles.label}>{Math.round(clamped * 100)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E3F2FD',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  label: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: 12,
    color: '#0D47A1',
    fontWeight: '700',
    ...typography.text,
  },
});
