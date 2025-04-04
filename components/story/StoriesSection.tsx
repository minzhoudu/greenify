import { ScrollView, View } from 'react-native';

import { styles } from '@/styles/feed.styles';
import Story from './Story';
import { STORIES } from './mock-data';

export default function StoriesSection() {
    return (
        <ScrollView horizontal style={styles.storiesContainer} showsVerticalScrollIndicator={false}>
            {STORIES.map((story) => (
                <Story key={story.id} story={story} />
            ))}
        </ScrollView>
    );
}
