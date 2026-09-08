import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#383838',
    },
    background: {
        ...StyleSheet.absoluteFill,
        width: undefined,
        height: undefined,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoWrapper: {
        width: '100%',
        aspectRatio: 2 / 3,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    title: {
        color: '#F2F2F2',
        fontSize: 60,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 70,
    },
    });