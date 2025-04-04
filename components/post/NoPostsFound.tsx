import { COLORS } from '@/constants/theme';
import { View, Text } from 'react-native';

export default function NoPostsFound() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background,
            }}
        >
            <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
        </View>
    );
}
