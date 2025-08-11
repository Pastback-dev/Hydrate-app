
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#1E88E5',       // Vibrant blue
  secondary: '#1976D2',     // Slightly darker blue
  accent: '#64B5F6',        // Light blue
  background: '#F6FBFF',    // Light blue/white background
  backgroundAlt: '#FFFFFF', // White
  text: '#1F2A44',          // Dark gray/blue text
  grey: '#9FB3C8',          // Muted gray
  card: '#FFFFFF',          // Cards white
  danger: '#E53935',
  success: '#2E7D32',
};

export const typography = {
  title: {
    fontFamily: 'Roboto_700Bold',
  } as TextStyle,
  text: {
    fontFamily: 'Roboto_400Regular',
  } as TextStyle,
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 900,
    width: '100%',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'left',
    color: colors.text,
    marginBottom: 8,
    ...typography.title,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
    textAlign: 'left',
    ...typography.text,
  },
  smallText: {
    fontSize: 13,
    color: colors.grey,
    ...typography.text,
  },
  section: {
    width: '100%',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: '#E3F2FD',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    width: '100%',
    boxShadow: '0px 3px 10px rgba(30, 136, 229, 0.12)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  hr: {
    height: 1,
    backgroundColor: '#E3F2FD',
    marginVertical: 10,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    boxShadow: '0px -2px 10px rgba(0,0,0,0.06)',
  },
  spacer: {
    height: 80,
    width: '100%',
  },
});
