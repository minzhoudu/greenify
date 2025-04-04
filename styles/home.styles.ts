import { StyleSheet } from 'react-native';

import { COLORS } from '@/constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    title: {
        color: 'red',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    image: {
        width: '50%',
        height: 170,
        resizeMode: 'contain',
    },
});
