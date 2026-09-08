import { StyleSheet } from 'react-native';

export const menuBarStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'rgba(251, 250, 250, 0.89)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
        borderBottomColor: 'rgba(39, 35, 31, 0.12)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        height: 56,
        justifyContent: 'space-between',
        marginLeft: -25,
        marginRight: -25,
        marginTop: -40,
        paddingHorizontal: 16,
    },
    backButton: {
        alignItems: 'center',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    backButtonPressed: {
        backgroundColor: 'rgba(39, 35, 31, 0.10)',
    },
    icon: {
        height: 24,
        width: 35,
    },
    title: {
        color: '#27231F',
        fontSize: 18,
        fontWeight: '700',
    },
    balanceSpace: {
        height: 40,
        width: 40,
    },
});