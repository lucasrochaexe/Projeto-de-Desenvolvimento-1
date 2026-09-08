import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383838',
  },
  background: {
    ...StyleSheet.absoluteFill,
    height: undefined,
    width: undefined,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    alignSelf: 'center',
    height: 120,
    marginBottom: 18,
    width: 190,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#D5D5D5',
    fontSize: 16,
    marginBottom: 28,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: '#252525',
    fontSize: 16,
    height: 54,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#D5A23A',
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#2B2520',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});