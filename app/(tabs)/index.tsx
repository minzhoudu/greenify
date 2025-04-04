import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '@/styles/home.styles';
import { Link } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function Index() {
    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => signOut()}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}
