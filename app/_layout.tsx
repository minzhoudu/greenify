import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import InitialLayout from '@/components/InitialLayout';
import { COLORS } from '@/constants/theme';
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider';

export default function RootLayout() {
    return (
        <ClerkAndConvexProvider>
            <SafeAreaProvider>
                <StatusBar backgroundColor={COLORS.background} />
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                    <InitialLayout />
                </SafeAreaView>
            </SafeAreaProvider>
        </ClerkAndConvexProvider>
    );
}
