import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import InitialLayout from '@/components/InitialLayout';
import { COLORS } from '@/constants/theme';
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider';
import { SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'JetBrainsMono-Medium': require('@/assets/fonts/JetBrainsMono-Medium.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded]);

    return (
        <ClerkAndConvexProvider>
            <SafeAreaProvider>
                <StatusBar backgroundColor={COLORS.background} />
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: COLORS.background }}
                    onLayout={onLayoutRootView}
                >
                    <InitialLayout />
                </SafeAreaView>
            </SafeAreaProvider>
        </ClerkAndConvexProvider>
    );
}
