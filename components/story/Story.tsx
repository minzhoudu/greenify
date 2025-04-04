import { styles } from '@/styles/feed.styles';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { type Story } from './mock-data';

export default function Story({ story }: { story: Story }) {
    return (
        <TouchableOpacity style={styles.storyWrapper}>
            <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
                <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
            </View>
            <Text style={styles.storyUsername}>
                {story.username.length > 10
                    ? story.username.slice(0, 10) + '...'
                    : story.username}
            </Text>
        </TouchableOpacity>
    );
}
