
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export default function Button({ text, onPress, style, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
    boxShadow: '0px 4px 10px rgba(30, 136, 229, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    ...typography.text,
  },
});
